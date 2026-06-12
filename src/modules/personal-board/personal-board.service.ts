import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PersonalSprintStatus, PersonalTaskStatus, Priority } from '@/common/graphql/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { CreatePersonalTaskInput } from './dto/create-personal-task.input';
import { UpdatePersonalTaskInput } from './dto/update-personal-task.input';
import { CreatePersonalSprintInput } from './dto/create-personal-sprint.input';
import { UpdatePersonalSprintInput } from './dto/update-personal-sprint.input';
import { ClosePersonalSprintAction, ClosePersonalSprintInput } from './dto/close-personal-sprint.input';

@Injectable()
export class PersonalBoardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

  async listPersonalTasks(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.personalTask.findMany({
      where: { orgId, userId },
      include: { sprint: true },
      orderBy: [{ columnKey: 'asc' }, { position: 'asc' }],
    });
  }

  async createPersonalTask(userId: string, input: CreatePersonalTaskInput) {
    await this.tenancy.assertOrgMembership(userId, input.orgId);
    const count = await this.prisma.personalTask.count({
      where: { userId, orgId: input.orgId, columnKey: 'TODO' },
    });
    return this.prisma.personalTask.create({
      data: {
        orgId: input.orgId,
        userId,
        title: input.title,
        status: input.status ?? PersonalTaskStatus.TODO,
        priority: input.priority ?? Priority.MED,
        dueDate: input.dueDate,
        columnKey: 'TODO',
        position: count,
        isSprintMapped: false,
      },
      include: { sprint: true },
    });
  }

  async updatePersonalTask(userId: string, input: UpdatePersonalTaskInput) {
    const task = await this.loadPersonalTaskOrThrow(input.id);
    await this.tenancy.assertOrgMembership(userId, task.orgId);

    const isMovingToDone = input.columnKey === 'DONE' && task.columnKey !== 'DONE';
    if (isMovingToDone && !task.isSprintMapped) {
      await this.prisma.personalTask.delete({ where: { id: input.id } });
      return { ...task, columnKey: 'DONE', updatedAt: new Date() };
    }

    const { id, sprintId, ...rest } = input;

    let sprintMappedUpdate: { isSprintMapped?: boolean } = {};
    if (sprintId !== undefined) {
      if (sprintId === null) {
        sprintMappedUpdate = { isSprintMapped: false };
      } else {
        const targetSprint = await this.prisma.personalSprint.findUnique({ where: { id: sprintId } });
        if (targetSprint?.status === PersonalSprintStatus.ACTIVE) {
          sprintMappedUpdate = { isSprintMapped: true };
        }
      }
    }

    return this.prisma.personalTask.update({
      where: { id },
      data: {
        ...rest,
        ...sprintMappedUpdate,
        ...(sprintId !== undefined
          ? { sprint: sprintId ? { connect: { id: sprintId } } : { disconnect: true } }
          : {}),
      },
      include: { sprint: true },
    });
  }

  async deletePersonalTask(userId: string, id: string) {
    const task = await this.loadPersonalTaskOrThrow(id);
    await this.tenancy.assertOrgMembership(userId, task.orgId);
    await this.prisma.personalTask.delete({ where: { id } });
    return true;
  }

  async listPersonalSprints(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.personalSprint.findMany({
      where: { orgId, userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPersonalSprint(userId: string, input: CreatePersonalSprintInput) {
    await this.tenancy.assertOrgMembership(userId, input.orgId);
    return this.prisma.personalSprint.create({
      data: {
        orgId: input.orgId,
        userId,
        name: input.name,
        startDate: input.startDate,
        endDate: input.endDate,
        targetPoints: input.targetPoints,
      },
    });
  }

  async updatePersonalSprint(userId: string, input: UpdatePersonalSprintInput) {
    const sprint = await this.loadPersonalSprintOrThrow(input.id);
    await this.tenancy.assertOrgMembership(userId, sprint.orgId);
    const { id, ...data } = input;
    return this.prisma.personalSprint.update({ where: { id }, data });
  }

  async startPersonalSprint(userId: string, sprintId: string) {
    const sprint = await this.loadPersonalSprintOrThrow(sprintId);
    await this.tenancy.assertOrgMembership(userId, sprint.orgId);
    if (sprint.status !== PersonalSprintStatus.PLANNING) {
      throw new BadRequestException('Apenas sprints em planejamento podem ser iniciadas');
    }
    const active = await this.prisma.personalSprint.findFirst({
      where: { userId, orgId: sprint.orgId, status: PersonalSprintStatus.ACTIVE },
    });
    if (active) {
      throw new BadRequestException('Já existe uma sprint ativa');
    }
    const started = await this.prisma.personalSprint.update({
      where: { id: sprintId },
      data: { status: PersonalSprintStatus.ACTIVE },
    });
    await this.prisma.personalTask.updateMany({
      where: { sprintId, isSprintMapped: false },
      data: { isSprintMapped: true },
    });
    return started;
  }

  async closePersonalSprint(userId: string, input: ClosePersonalSprintInput) {
    const sprint = await this.loadPersonalSprintOrThrow(input.sprintId);
    await this.tenancy.assertOrgMembership(userId, sprint.orgId);
    if (sprint.status !== PersonalSprintStatus.ACTIVE) {
      throw new BadRequestException('Apenas sprints ativas podem ser encerradas');
    }

    const pendingTasks = await this.prisma.personalTask.findMany({
      where: { sprintId: input.sprintId, columnKey: { not: 'DONE' } },
    });

    if (pendingTasks.length === 0) {
      return this.prisma.personalSprint.update({
        where: { id: input.sprintId },
        data: { status: PersonalSprintStatus.CLOSED },
      });
    }

    if (!input.action) {
      throw new BadRequestException('Ação obrigatória: existem tarefas pendentes nesta sprint');
    }

    if (input.action === ClosePersonalSprintAction.MOVE_TO_BACKLOG) {
      await this.prisma.personalTask.updateMany({
        where: { sprintId: input.sprintId, columnKey: { not: 'DONE' } },
        data: { sprintId: null, isSprintMapped: false },
      });
      return this.prisma.personalSprint.update({
        where: { id: input.sprintId },
        data: { status: PersonalSprintStatus.CLOSED },
      });
    }

    if (input.action === ClosePersonalSprintAction.MARK_DONE) {
      await this.prisma.personalTask.updateMany({
        where: { sprintId: input.sprintId, columnKey: { not: 'DONE' } },
        data: { columnKey: 'DONE', status: PersonalTaskStatus.DONE },
      });
      return this.prisma.personalSprint.update({
        where: { id: input.sprintId },
        data: { status: PersonalSprintStatus.CLOSED },
      });
    }

    return this.prisma.personalSprint.update({
      where: { id: input.sprintId },
      data: { status: PersonalSprintStatus.INCOMPLETE },
    });
  }

  async restartPersonalSprint(userId: string, sprintId: string) {
    const sprint = await this.loadPersonalSprintOrThrow(sprintId);
    await this.tenancy.assertOrgMembership(userId, sprint.orgId);

    const isCloseable =
      sprint.status === PersonalSprintStatus.CLOSED ||
      sprint.status === PersonalSprintStatus.INCOMPLETE;
    if (!isCloseable) {
      throw new BadRequestException('Apenas sprints encerradas ou incompletas podem ser reiniciadas');
    }

    const active = await this.prisma.personalSprint.findFirst({
      where: { userId, orgId: sprint.orgId, status: PersonalSprintStatus.ACTIVE },
    });
    if (active) {
      throw new BadRequestException('Já existe uma sprint ativa');
    }

    const restarted = await this.prisma.personalSprint.create({
      data: {
        orgId: sprint.orgId,
        userId,
        name: `${sprint.name} (reinício)`,
        parentSprintId: sprintId,
        status: PersonalSprintStatus.ACTIVE,
      },
    });

    await this.prisma.personalTask.updateMany({
      where: { sprintId, columnKey: { not: 'DONE' } },
      data: { sprintId: restarted.id, isSprintMapped: true },
    });

    return restarted;
  }

  async deletePersonalSprint(userId: string, sprintId: string) {
    const sprint = await this.loadPersonalSprintOrThrow(sprintId);
    await this.tenancy.assertOrgMembership(userId, sprint.orgId);
    await this.prisma.personalSprint.delete({ where: { id: sprintId } });
    return true;
  }

  async listPersonalSprintSnapshots(userId: string, sprintId: string) {
    const sprint = await this.loadPersonalSprintOrThrow(sprintId);
    await this.tenancy.assertOrgMembership(userId, sprint.orgId);
    return this.prisma.personalSprintSnapshot.findMany({
      where: { sprintId },
      orderBy: { capturedOn: 'asc' },
    });
  }

  async listPersonalVelocityData(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    const sprints = await this.prisma.personalSprint.findMany({
      where: {
        userId,
        orgId,
        status: { in: [PersonalSprintStatus.CLOSED, PersonalSprintStatus.INCOMPLETE] },
      },
      include: {
        tasks: { select: { columnKey: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return sprints.map((sprint) => ({
      sprintId: sprint.id,
      name: sprint.name,
      totalTasks: sprint.tasks.length,
      completedTasks: sprint.tasks.filter((t) => t.columnKey === 'DONE').length,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
    }));
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async capturePersonalSprintSnapshots() {
    const sprints = await this.prisma.personalSprint.findMany({
      where: { status: PersonalSprintStatus.ACTIVE },
      include: { tasks: { select: { columnKey: true } } },
    });
    for (const sprint of sprints) {
      const totalTasks = sprint.tasks.length;
      const completedTasks = sprint.tasks.filter((t) => t.columnKey === 'DONE').length;
      const remainingTasks = totalTasks - completedTasks;
      await this.prisma.personalSprintSnapshot.create({
        data: { sprintId: sprint.id, totalTasks, completedTasks, remainingTasks },
      });
    }
    return sprints.length;
  }

  private async loadPersonalTaskOrThrow(id: string) {
    const task = await this.prisma.personalTask.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    return task;
  }

  private async loadPersonalSprintOrThrow(id: string) {
    const sprint = await this.prisma.personalSprint.findUnique({ where: { id } });
    if (!sprint) throw new NotFoundException('Sprint não encontrada');
    return sprint;
  }
}
