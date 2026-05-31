import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { SprintStatus } from '@/common/graphql/enums';
import { CreateSprintInput } from './dto/create-sprint.input';
import { UpdateSprintInput } from './dto/update-sprint.input';

@Injectable()
export class SprintsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

  async listSprintsByProject(userId: string, projectId: string) {
    await this.tenancy.assertProjectAccess(userId, projectId);
    return this.prisma.sprint.findMany({
      where: { projectId },
      orderBy: { number: 'desc' },
    });
  }

  async findActiveSprintSummary(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    const sprint = await this.prisma.sprint.findFirst({
      where: { status: SprintStatus.ACTIVE, project: { orgId } },
      orderBy: { number: 'desc' },
    });
    if (!sprint) return null;

    const issues = await this.prisma.issue.findMany({
      where: { sprintId: sprint.id },
      include: {
        column: { select: { name: true } },
        assignees: { include: { user: { select: { name: true } } } },
      },
    });

    const pointsTotal = issues.reduce((total, issue) => total + (issue.points ?? 0), 0);
    const pointsDone = issues
      .filter((issue) => issue.done)
      .reduce((total, issue) => total + (issue.points ?? 0), 0);
    const inReview = issues.filter((issue) => issue.column.name === 'Review').length;

    const memberNames = new Set<string>();
    for (const issue of issues) {
      for (const assignee of issue.assignees) {
        if (assignee.user.name) memberNames.add(assignee.user.name);
      }
    }

    const dayInMs = 86400000;
    const daysRemaining = sprint.endDate
      ? Math.max(0, Math.ceil((sprint.endDate.getTime() - Date.now()) / dayInMs))
      : 0;
    const durationDays =
      sprint.startDate && sprint.endDate
        ? Math.max(1, Math.round((sprint.endDate.getTime() - sprint.startDate.getTime()) / dayInMs))
        : 0;

    return {
      id: sprint.id,
      number: sprint.number,
      name: sprint.name,
      pointsDone,
      pointsTotal,
      issueCount: issues.length,
      inReview,
      daysRemaining,
      durationDays,
      members: [...memberNames],
      startDate: sprint.startDate ?? undefined,
      endDate: sprint.endDate ?? undefined,
    };
  }

  async findSprintById(userId: string, id: string) {
    const sprint = await this.loadSprintOrThrow(id);
    await this.tenancy.assertProjectAccess(userId, sprint.projectId);
    return sprint;
  }

  async createSprint(userId: string, input: CreateSprintInput) {
    await this.tenancy.assertProjectAccess(userId, input.projectId);
    return this.prisma.sprint.create({
      data: {
        projectId: input.projectId,
        number: input.number,
        name: input.name,
        code: input.code,
        targetPoints: input.targetPoints,
      },
    });
  }

  async updateSprint(userId: string, input: UpdateSprintInput) {
    const sprint = await this.loadSprintOrThrow(input.id);
    await this.tenancy.assertProjectAccess(userId, sprint.projectId);
    const { id, ...rest } = input;
    return this.prisma.sprint.update({
      where: { id },
      data: rest,
    });
  }

  async removeSprint(userId: string, id: string) {
    const sprint = await this.loadSprintOrThrow(id);
    await this.tenancy.assertProjectAccess(userId, sprint.projectId);
    await this.prisma.sprint.delete({ where: { id } });
    return true;
  }

  async startSprintById(userId: string, id: string) {
    const sprint = await this.loadSprintOrThrow(id);
    await this.tenancy.assertProjectAccess(userId, sprint.projectId);
    return this.prisma.sprint.update({
      where: { id },
      data: { status: SprintStatus.ACTIVE },
    });
  }

  async closeSprintById(userId: string, id: string) {
    const sprint = await this.loadSprintOrThrow(id);
    await this.tenancy.assertProjectAccess(userId, sprint.projectId);
    return this.prisma.sprint.update({
      where: { id },
      data: { status: SprintStatus.CLOSED },
    });
  }

  private async loadSprintOrThrow(id: string) {
    const sprint = await this.prisma.sprint.findUnique({ where: { id } });
    if (!sprint) throw new NotFoundException('Sprint não encontrada');
    return sprint;
  }
}
