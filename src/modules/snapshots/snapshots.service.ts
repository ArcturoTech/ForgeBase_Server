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

  private async loadSprintForAccess(userId: string, sprintId: string) {
    const sprint = await this.prisma.sprint.findUnique({ where: { id: sprintId } });
    if (!sprint) throw new NotFoundException('Sprint não encontrada');
    await this.tenancy.assertProjectAccess(userId, sprint.projectId);
    return sprint;
  }

  async listSprintTagComposition(userId: string, sprintId: string) {
    await this.loadSprintForAccess(userId, sprintId);
    const issues = await this.prisma.issue.findMany({
      where: { sprintId },
      select: {
        points: true,
        labels: { include: { label: { select: { name: true } } } },
      },
    });

    const slicesByTag = new Map<string, { points: number; issues: number }>();
    const addToTag = (tag: string, points: number) => {
      const slice = slicesByTag.get(tag) ?? { points: 0, issues: 0 };
      slice.points += points;
      slice.issues += 1;
      slicesByTag.set(tag, slice);
    };

    for (const issue of issues) {
      const points = issue.points ?? 0;
      if (issue.labels.length === 0) {
        addToTag('sem tag', points);
        continue;
      }
      for (const link of issue.labels) {
        addToTag(link.label.name, points);
      }
    }

    return [...slicesByTag.entries()]
      .map(([tag, slice]) => ({ tag, points: slice.points, issues: slice.issues }))
      .sort((a, b) => b.points - a.points);
  }

  async listSprintMemberLoad(userId: string, sprintId: string) {
    await this.loadSprintForAccess(userId, sprintId);
    const issues = await this.prisma.issue.findMany({
      where: { sprintId },
      select: {
        points: true,
        done: true,
        assignees: { include: { user: { select: { id: true, name: true } } } },
      },
    });

    const loadByUser = new Map<
      string,
      { name: string; done: number; doing: number; capacity: number }
    >();

    for (const issue of issues) {
      const points = issue.points ?? 0;
      for (const assignee of issue.assignees) {
        const load = loadByUser.get(assignee.userId) ?? {
          name: assignee.user.name ?? '—',
          done: 0,
          doing: 0,
          capacity: 0,
        };
        load.capacity += points;
        if (issue.done) {
          load.done += points;
        } else {
          load.doing += points;
        }
        loadByUser.set(assignee.userId, load);
      }
    }

    return [...loadByUser.values()].sort((a, b) => b.capacity - a.capacity);
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

  async listIssueTypeDistribution(userId: string, projectId: string, sprintIds?: string[]) {
    await this.tenancy.assertProjectAccess(userId, projectId);
    const sprints = await this.prisma.sprint.findMany({
      where: {
        projectId,
        ...(sprintIds?.length ? { id: { in: sprintIds } } : {}),
      },
      orderBy: { number: 'asc' },
      include: {
        issues: { select: { type: true } },
      },
    });

    return sprints.map((sprint) => {
      const counts = { epic: 0, story: 0, task: 0, bug: 0 };
      for (const issue of sprint.issues) {
        const key = issue.type.toLowerCase() as keyof typeof counts;
        if (key in counts) counts[key] += 1;
      }
      return {
        sprintId: sprint.id,
        sprintNumber: sprint.number,
        label: `S${sprint.number}`,
        ...counts,
        total: sprint.issues.length,
      };
    });
  }

  async listSprintCompletionRate(userId: string, projectId: string) {
    await this.tenancy.assertProjectAccess(userId, projectId);
    const sprints = await this.prisma.sprint.findMany({
      where: { projectId },
      orderBy: { number: 'asc' },
      include: { issues: { select: { done: true } } },
    });

    return sprints.map((sprint) => {
      const total = sprint.issues.length;
      const done = sprint.issues.filter((i) => i.done).length;
      return {
        sprintId: sprint.id,
        sprintNumber: sprint.number,
        label: `S${sprint.number}`,
        total,
        done,
        rate: total > 0 ? Math.round((done / total) * 100) : 0,
      };
    });
  }

  async listSprintThroughput(userId: string, projectId: string) {
    await this.tenancy.assertProjectAccess(userId, projectId);
    const sprints = await this.prisma.sprint.findMany({
      where: { projectId },
      orderBy: { number: 'asc' },
      include: { issues: { select: { done: true } } },
    });

    return sprints.map((sprint) => ({
      sprintId: sprint.id,
      sprintNumber: sprint.number,
      label: `S${sprint.number}`,
      completedIssues: sprint.issues.filter((i) => i.done).length,
    }));
  }
}
