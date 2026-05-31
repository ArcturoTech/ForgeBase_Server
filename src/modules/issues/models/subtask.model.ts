import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Subtask {
  @Field(() => ID)
  id: string;

  @Field()
  issueId: string;

  @Field()
  label: string;

  @Field()
  done: boolean;

  @Field(() => Int)
  position: number;
}
