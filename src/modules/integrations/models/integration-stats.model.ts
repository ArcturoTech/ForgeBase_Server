import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IntegrationStats {
  @Field(() => Int)
  activeApiKeys: number;

  @Field(() => Int)
  totalWebhooks: number;

  @Field(() => Int)
  failingWebhooks: number;

  @Field(() => Float)
  averageSuccessRate: number;
}
