import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrganizationUsage {
  @Field(() => Int)
  memberCount: number;

  @Field(() => Int)
  memberLimit: number;

  @Field(() => Int)
  storageMbUsed: number;

  @Field(() => Int)
  storageMbLimit: number;

  @Field(() => Int)
  webhookCount: number;

  @Field(() => Int)
  webhookLimit: number;

  @Field(() => Int)
  apiKeyCount: number;
}
