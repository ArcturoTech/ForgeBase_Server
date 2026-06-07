import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { ResourceType } from '@/common/graphql/enums';

@InputType()
export class UpdateProjectResourceInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field(() => ResourceType, { nullable: true })
  @IsOptional()
  @IsEnum(ResourceType)
  type?: ResourceType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  label?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  url?: string;
}
