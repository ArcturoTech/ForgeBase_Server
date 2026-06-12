import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SprintThroughput {
  @Field(() => ID)
  sprintId: string;

  @Field(() => Int)
  sprintNumber: number;

  @Field()
  label: string;

  @Field(() => Int)
  completedIssues: number;
}
