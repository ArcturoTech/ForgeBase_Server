import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string;

  @Field()
  orgId: string;

  @Field()
  userId: string;

  @Field()
  type: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  body?: string;

  @Field()
  read: boolean;

  @Field()
  createdAt: Date;
}
