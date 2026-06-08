import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReactionGroup {
  @Field()
  emoji: string;

  @Field(() => Int)
  count: number;

  @Field()
  reactedByMe: boolean;

  @Field(() => [ID])
  userIds: string[];
}
