import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayMaxSize, IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateChatSpaceInput {
  @Field(() => ID)
  @IsString()
  orgId: string;

  @Field()
  @IsString()
  @MaxLength(80)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(280)
  description?: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  memberIds?: string[];
}
