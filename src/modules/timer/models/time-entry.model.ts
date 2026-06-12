import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TimeEntry {
  @Field(() => ID)
  id: string;

  @Field()
  orgId: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  issueId?: string;

  @Field()
  startedAt: Date;

  @Field({ nullable: true })
  stoppedAt?: Date;

  @Field(() => Int, { nullable: true })
  duration?: number;
}
