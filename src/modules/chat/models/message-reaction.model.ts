import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageReaction {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  messageId: string;

  @Field(() => ID)
  userId: string;

  @Field()
  emoji: string;

  @Field()
  createdAt: Date;
}
