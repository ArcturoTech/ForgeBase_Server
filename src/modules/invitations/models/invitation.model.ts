import { Field, ID, ObjectType } from '@nestjs/graphql';
import { InvitationStatus, MemberRole } from '@/common/graphql/enums';

@ObjectType()
export class Invitation {
  @Field(() => ID)
  id: string;

  @Field()
  orgId: string;

  @Field()
  email: string;

  @Field(() => MemberRole)
  role: MemberRole;

  @Field(() => InvitationStatus)
  status: InvitationStatus;

  @Field()
  expiresAt: Date;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  orgName?: string;
}
