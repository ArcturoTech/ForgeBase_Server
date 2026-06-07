import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';
import { ResourceType } from '@/common/graphql/enums';

@InputType()
export class CreateProjectResourceInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @Field(() => ResourceType)
  @IsEnum(ResourceType)
  type: ResourceType;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  label: string;

  @Field()
  @IsUrl()
  url: string;
}
