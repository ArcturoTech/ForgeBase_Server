import { Field, ID, InputType } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  body?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  replyToId?: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  attachmentIds?: string[];
}
