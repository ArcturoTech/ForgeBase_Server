import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PlatformStats {
  @Field(() => Int)
  totalOrganizations: number;

  @Field(() => Int)
  activeOrganizations: number;

  @Field(() => Int)
  trialOrganizations: number;

  @Field(() => Int)
  suspendedOrganizations: number;

  @Field(() => Int)
  totalUsers: number;

  @Field(() => Int)
  totalMrrCents: number;
}
