import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength } from 'class-validator';

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
}
