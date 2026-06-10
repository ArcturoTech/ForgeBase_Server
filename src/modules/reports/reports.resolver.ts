import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { WeeklyReport } from './models/weekly-report.model';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver()
export class ReportsResolver {
  constructor(private readonly reportsService: ReportsService) {}

  @Query(() => WeeklyReport)
  @UseGuards(GqlAuthGuard)
  findWeeklyReport(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
    @Args('weekStart', { nullable: true }) weekStart?: Date,
  ): Promise<WeeklyReport> {
    return this.reportsService.findWeeklyReport(user.id, orgId, weekStart);
  }
}
