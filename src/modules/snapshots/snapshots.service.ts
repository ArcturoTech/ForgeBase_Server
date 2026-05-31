import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { SprintStatus } from '@/common/graphql/enums';

@Injectable()
export class SnapshotsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async captureActiveSprintSnapshots() {
    const sprints = await this.prisma.sprint.findMany({
      where: { status: SprintStatus.ACTIVE },
      include: { issues: { select: { points: true, done: true } } },
    });
    for (const sprint of sprints) {
      const totalPoints = sprint.issues.reduce((total, issue) => total + (issue.points ?? 0), 0);
      const remainingPoints = sprint.issues
        .filter((issue) => !issue.done)
        .reduce((total, issue) => total + (issue.points ?? 0), 0);
      await this.prisma.sprintSnapshot.create({
        data: { sprintId: sprint.id, totalPoints, remainingPoints },
      });
    }
    return sprints.length;
  }

  async listSnapshotsBySprint(userId: string, sprintId: string) {
    const sprint = await this.prisma.sprint.findUnique({ where: { id: sprintId } });
    if (!sprint) throw new NotFoundException('Sprint não encontrada');
    await this.tenancy.assertProjectAccess(userId, sprint.projectId);
    return this.prisma.sprintSnapshot.findMany({
      where: { sprintId },
      orderBy: { capturedOn: 'asc' },
    });
  }

  async listVelocityByProject(userId: string, projectId: string) {
    await this.tenancy.assertProjectAccess(userId, projectId);
    const sprints = await this.prisma.sprint.findMany({
      where: { projectId },
      orderBy: { number: 'asc' },
      include: { issues: { select: { points: true, done: true } } },
    });
    return sprints.map((sprint) => ({
      sprintNumber: sprint.number,
      label: `S${sprint.number}`,
      planned: sprint.targetPoints ?? sprint.issues.reduce((total, issue) => total + (issue.points ?? 0), 0),
      done: sprint.issues.filter((issue) => issue.done).reduce((total, issue) => total + (issue.points ?? 0), 0),
    }));
  }
}
