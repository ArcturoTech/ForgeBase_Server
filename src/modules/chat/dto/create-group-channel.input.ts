import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayUnique, IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateGroupChannelInput {
  @Field(() => ID)
  @IsString()
  orgId: string;

  @Field(() => ID)
  @IsString()
  spaceId: string;

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
  @ArrayUnique()
  memberIds?: string[];
}
