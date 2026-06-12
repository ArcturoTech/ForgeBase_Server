import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SprintTypeDistribution {
  @Field(() => ID)
  sprintId: string;

  @Field(() => Int)
  sprintNumber: number;

  @Field()
  label: string;

  @Field(() => Int)
  epic: number;

  @Field(() => Int)
  story: number;

  @Field(() => Int)
  task: number;

  @Field(() => Int)
  bug: number;

  @Field(() => Int)
  total: number;
}
