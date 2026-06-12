import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ChannelType } from '@/common/graphql/enums';
import { ChannelMember } from './channel-member.model';
import { Message } from './message.model';

@ObjectType()
export class Channel {
  @Field(() => ID)
  id: string;

  @Field()
  orgId: string;

  @Field({ nullable: true })
  spaceId?: string;

  @Field(() => ChannelType)
  type: ChannelType;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  createdById?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [ChannelMember], { nullable: true })
  members?: ChannelMember[];

  @Field(() => Message, { nullable: true })
  lastMessage?: Message;

  @Field(() => Int)
  unreadCount: number;

  @Field({ defaultValue: false })
  muted: boolean;
}
