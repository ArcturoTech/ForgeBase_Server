import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WeeklyReportDay {
  @Field()
  label: string;

  @Field(() => Int)
  points: number;

  @Field(() => Int)
  issues: number;
}
