import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { WebhookStatus } from '@/common/graphql/enums';

@ObjectType()
export class Webhook {
  @Field(() => ID)
  id: string;

  @Field()
  url: string;

  @Field(() => [String])
  events: string[];

  @Field(() => WebhookStatus)
  status: WebhookStatus;

  @Field(() => Float)
  successRate: number;

  @Field({ nullable: true })
  lastDeliveryAt?: Date;

  @Field()
  createdAt: Date;
}
