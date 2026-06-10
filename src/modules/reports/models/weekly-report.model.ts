import { Field, Int, ObjectType } from '@nestjs/graphql';
import { WeeklyReportDay } from './weekly-report-day.model';

@ObjectType()
export class WeeklyReport {
  @Field()
  weekStart: Date;

  @Field()
  weekEnd: Date;

  @Field(() => Int)
  issuesCompleted: number;

  @Field(() => Int)
  pointsCompleted: number;

  @Field(() => Int)
  contractsCreated: number;

  @Field(() => Int)
  invoicesCreated: number;

  @Field(() => Int)
  invoicesAmountCents: number;

  @Field(() => Int)
  activityCount: number;

  @Field(() => [WeeklyReportDay])
  dailyCompleted: WeeklyReportDay[];
}
