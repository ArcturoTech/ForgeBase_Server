import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserStatus } from '@/modules/presence/models/user-status.model';

@ObjectType()
export class UserProfile {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  jobTitle?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field()
  createdAt: Date;

  @Field(() => UserStatus, { nullable: true })
  userStatus?: UserStatus;
}
