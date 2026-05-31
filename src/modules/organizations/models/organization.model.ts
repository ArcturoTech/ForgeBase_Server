import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { OrgPlan, OrgStatus } from '@/common/graphql/enums';

@ObjectType()
export class Organization {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field(() => OrgPlan)
  plan: OrgPlan;

  @Field(() => OrgStatus)
  status: OrgStatus;

  @Field()
  region: string;

  @Field({ nullable: true })
  databaseName?: string;

  @Field(() => Int)
  mrrCents: number;

  @Field({ nullable: true })
  trialEndsAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
