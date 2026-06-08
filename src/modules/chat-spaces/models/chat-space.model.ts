import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ChatSpaceKind } from '@/common/graphql/enums';

@ObjectType()
export class ChatSpace {
  @Field(() => ID)
  id: string;

  @Field()
  orgId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ChatSpaceKind)
  kind: ChatSpaceKind;

  @Field({ nullable: true })
  createdById?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Int)
  memberCount: number;
}
