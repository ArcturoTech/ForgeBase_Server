import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContractStatus } from '@/common/graphql/enums';

@InputType()
export class UpdateContractInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  clientName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  valueLabel?: string;

  @Field(() => ContractStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  expiresAt?: Date;
}
