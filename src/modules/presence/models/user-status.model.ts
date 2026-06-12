import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PresenceStatus } from '@/common/graphql/enums';

@ObjectType()
export class UserStatus {
  @Field(() => ID)
  userId: string;

  @Field(() => PresenceStatus)
  status: PresenceStatus;

  @Field({ nullable: true })
  emoji?: string;

  @Field({ nullable: true })
  customText?: string;

  @Field()
  setAt: Date;

  @Field()
  isManual: boolean;
}
