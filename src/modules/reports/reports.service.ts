import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { WeeklyReport } from './models/weekly-report.model';

const DAY_IN_MS = 86400000;
const WEEK_DAY_LABELS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

  async findWeeklyReport(
    userId: string,
    orgId: string,
    weekStartInput?: Date,
  ): Promise<WeeklyReport> {
    await this.tenancy.assertOrgMembership(userId, orgId);

    const weekStart = this.startOfWeek(weekStartInput ?? new Date());
    const weekEnd = new Date(weekStart.getTime() + 7 * DAY_IN_MS);
    const window = { gte: weekStart, lt: weekEnd };

    const [completedIssues, contractsCreated, invoicesAggregate, activityCount] = await Promise.all([
      this.prisma.issue.findMany({
        where: { orgId, done: true, updatedAt: window },
        select: { points: true, updatedAt: true },
      }),
      this.prisma.contract.count({ where: { orgId, createdAt: window } }),
      this.prisma.invoice.aggregate({
        where: { orgId, createdAt: window },
        _count: { _all: true },
        _sum: { amountCents: true },
      }),
      this.prisma.activity.count({ where: { orgId, createdAt: window } }),
    ]);

    const pointsCompleted = completedIssues.reduce(
      (total, issue) => total + (issue.points ?? 0),
      0,
    );

    return {
      weekStart,
      weekEnd,
      issuesCompleted: completedIssues.length,
      pointsCompleted,
      contractsCreated,
      invoicesCreated: invoicesAggregate._count._all,
      invoicesAmountCents: invoicesAggregate._sum.amountCents ?? 0,
      activityCount,
      dailyCompleted: this.bucketCompletedByDay(completedIssues, weekStart),
    };
  }

  private startOfWeek(reference: Date): Date {
    const date = new Date(reference);
    date.setHours(0, 0, 0, 0);
    const weekday = date.getDay();
    const shiftToMonday = weekday === 0 ? -6 : 1 - weekday;
    date.setDate(date.getDate() + shiftToMonday);
    return date;
  }

  private bucketCompletedByDay(
    issues: { points: number | null; updatedAt: Date }[],
    weekStart: Date,
  ) {
    const buckets = WEEK_DAY_LABELS.map((label) => ({ label, points: 0, issues: 0 }));
    for (const issue of issues) {
      const dayIndex = Math.floor((issue.updatedAt.getTime() - weekStart.getTime()) / DAY_IN_MS);
      if (dayIndex < 0 || dayIndex > 6) continue;
      buckets[dayIndex].points += issue.points ?? 0;
      buckets[dayIndex].issues += 1;
    }
    return buckets;
  }
}
