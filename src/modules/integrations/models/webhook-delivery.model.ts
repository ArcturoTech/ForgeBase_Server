import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WebhookDelivery {
  @Field(() => ID)
  id: string;

  @Field()
  webhookId: string;

  @Field()
  event: string;

  @Field(() => Int)
  statusCode: number;

  @Field(() => Int)
  durationMs: number;

  @Field()
  target: string;

  @Field()
  failed: boolean;

  @Field({ nullable: true })
  retryLabel?: string;

  @Field()
  createdAt: Date;
}
