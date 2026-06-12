import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { SprintClosureType, SprintStatus } from '@/common/graphql/enums';

@ObjectType()
export class Sprint {
  @Field(() => ID)
  id: string;

  @Field()
  projectId: string;

  @Field(() => Int)
  number: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  code?: string;

  @Field(() => SprintStatus)
  status: SprintStatus;

  @Field(() => SprintClosureType, { nullable: true })
  closedAs?: SprintClosureType;

  @Field(() => ID, { nullable: true })
  parentSprintId?: string;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => Int)
  totalPoints: number;

  @Field(() => Int, { nullable: true })
  targetPoints?: number;

  @Field()
  createdAt: Date;
}
