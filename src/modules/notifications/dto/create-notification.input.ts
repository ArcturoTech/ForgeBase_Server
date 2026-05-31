import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateNotificationInput {
  @Field(() => ID)
  @IsString()
  orgId: string;

  @Field(() => ID)
  @IsString()
  userId: string;

  @Field()
  @IsString()
  type: string;

  @Field()
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  body?: string;
}
