import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ContractStatus } from '@/common/graphql/enums';

@ObjectType()
export class Contract {
  @Field(() => ID)
  id: string;

  @Field()
  orgId: string;

  @Field({ nullable: true })
  projectId?: string;

  @Field()
  number: string;

  @Field()
  clientName: string;

  @Field()
  name: string;

  @Field()
  valueLabel: string;

  @Field(() => ContractStatus)
  status: ContractStatus;

  @Field({ nullable: true })
  expiresAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
