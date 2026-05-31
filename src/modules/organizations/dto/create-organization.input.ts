import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrgPlan } from '@/common/graphql/enums';

@InputType()
export class CreateOrganizationInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  slug: string;

  @Field(() => OrgPlan, { nullable: true })
  @IsOptional()
  @IsEnum(OrgPlan)
  plan?: OrgPlan;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  region?: string;
}
