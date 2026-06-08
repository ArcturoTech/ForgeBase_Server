import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ReactionGroup } from './reaction-group.model';

@ObjectType()
export class ReactionChangedEvent {
  @Field(() => ID)
  messageId: string;

  @Field(() => ID)
  channelId: string;

  @Field(() => [ReactionGroup])
  reactions: ReactionGroup[];
}
