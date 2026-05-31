import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ApiKeyStatus } from '@/common/graphql/enums';

@ObjectType()
export class ApiKey {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  prefix: string;

  @Field()
  scope: string;

  @Field(() => ApiKeyStatus)
  status: ApiKeyStatus;

  @Field({ nullable: true })
  lastUsedAt?: Date;

  @Field(() => Int)
  callCount: number;

  @Field()
  createdAt: Date;
}
