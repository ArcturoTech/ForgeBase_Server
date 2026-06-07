import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ChannelMemberRole } from '@/common/graphql/enums';
import { User } from '@/users/models/user.model';

@ObjectType()
export class ChannelMember {
  @Field(() => ID)
  id: string;

  @Field()
  channelId: string;

  @Field()
  userId: string;

  @Field(() => ChannelMemberRole)
  role: ChannelMemberRole;

  @Field({ nullable: true })
  lastReadAt?: Date;

  @Field()
  createdAt: Date;

  @Field(() => User, { nullable: true })
  user?: User;
}
