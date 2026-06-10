import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SprintMemberLoad {
  @Field()
  name: string;

  @Field(() => Int)
  done: number;

  @Field(() => Int)
  doing: number;

  @Field(() => Int)
  capacity: number;
}
