import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  body: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  replyToId?: string;
}
