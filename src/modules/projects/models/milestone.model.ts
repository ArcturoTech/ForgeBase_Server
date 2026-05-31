import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Milestone {
  @Field(() => ID)
  id: string;

  @Field()
  projectId: string;

  @Field()
  name: string;

  @Field(() => Int)
  startMonth: number;

  @Field(() => Int)
  endMonth: number;

  @Field()
  color: string;

  @Field()
  done: boolean;

  @Field()
  current: boolean;

  @Field(() => Int)
  progress: number;
}
