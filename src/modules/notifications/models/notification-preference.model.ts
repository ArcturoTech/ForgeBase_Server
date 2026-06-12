import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NotificationPreference {
  @Field(() => ID)
  userId: string;

  @Field()
  leadAssigned: boolean;

  @Field()
  dealUpdate: boolean;

  @Field()
  taskDue: boolean;

  @Field()
  chatMessage: boolean;

  @Field()
  weeklyDigest: boolean;
}
