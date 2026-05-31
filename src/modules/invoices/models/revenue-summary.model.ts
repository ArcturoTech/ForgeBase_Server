import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RevenueSummary {
  @Field(() => Int)
  mrrCents: number;

  @Field(() => Int)
  receivableCents: number;

  @Field(() => Int)
  overdueCents: number;

  @Field(() => Int)
  receivedCents: number;
}
