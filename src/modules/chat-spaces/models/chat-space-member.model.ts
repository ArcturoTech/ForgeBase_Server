import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ChatSpaceRole } from '@/common/graphql/enums';
import { User } from '@/users/models/user.model';

@ObjectType()
export class ChatSpaceMember {
  @Field(() => ID)
  id: string;

  @Field()
  spaceId: string;

  @Field()
  userId: string;

  @Field(() => ChatSpaceRole)
  role: ChatSpaceRole;

  @Field()
  createdAt: Date;

  @Field(() => User, { nullable: true })
  user?: User;
}
