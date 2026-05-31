import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SprintSummary {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  number: number;

  @Field()
  name: string;

  @Field(() => Int)
  pointsDone: number;

  @Field(() => Int)
  pointsTotal: number;

  @Field(() => Int)
  issueCount: number;

  @Field(() => Int)
  inReview: number;

  @Field(() => Int)
  daysRemaining: number;

  @Field(() => Int)
  durationDays: number;

  @Field(() => [String])
  members: string[];

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;
}
