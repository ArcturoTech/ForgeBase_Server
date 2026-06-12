import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SprintCompletionRate {
  @Field(() => ID)
  sprintId: string;

  @Field(() => Int)
  sprintNumber: number;

  @Field()
  label: string;

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  done: number;

  @Field(() => Float)
  rate: number;
}
