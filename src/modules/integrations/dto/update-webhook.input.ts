import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { WebhookStatus } from '@/common/graphql/enums';

@InputType()
export class UpdateWebhookInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  url?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  events?: string[];

  @Field(() => WebhookStatus, { nullable: true })
  @IsOptional()
  @IsEnum(WebhookStatus)
  status?: WebhookStatus;
}
