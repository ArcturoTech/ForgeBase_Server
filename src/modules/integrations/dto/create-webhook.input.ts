import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsString, IsUrl } from 'class-validator';

@InputType()
export class CreateWebhookInput {
  @Field(() => ID)
  @IsString()
  orgId: string;

  @Field()
  @IsUrl()
  url: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  events: string[];
}
