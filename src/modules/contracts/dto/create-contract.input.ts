import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContractStatus } from '@/common/graphql/enums';

@InputType()
export class CreateContractInput {
  @Field(() => ID)
  @IsString()
  orgId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  projectId?: string;

  @Field()
  @IsString()
  number: string;

  @Field()
  @IsString()
  clientName: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  valueLabel: string;

  @Field(() => ContractStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  expiresAt?: Date;
}
