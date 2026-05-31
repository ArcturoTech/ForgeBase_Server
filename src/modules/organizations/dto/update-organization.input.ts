import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { OrgPlan, OrgStatus } from '@/common/graphql/enums';

@InputType()
export class UpdateOrganizationInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  slug?: string;

  @Field(() => OrgPlan, { nullable: true })
  @IsOptional()
  @IsEnum(OrgPlan)
  plan?: OrgPlan;

  @Field(() => OrgStatus, { nullable: true })
  @IsOptional()
  @IsEnum(OrgStatus)
  status?: OrgStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  region?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  mrrCents?: number;
}
