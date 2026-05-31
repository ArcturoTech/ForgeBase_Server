import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MemberRole } from '@/common/graphql/enums';
import { User } from '@/users/models/user.model';

@ObjectType()
export class Member {
  @Field(() => ID)
  id: string;

  @Field()
  orgId: string;

  @Field()
  userId: string;

  @Field(() => MemberRole)
  role: MemberRole;

  @Field({ nullable: true })
  title?: string;

  @Field()
  createdAt: Date;

  @Field(() => User)
  user?: User;
}
