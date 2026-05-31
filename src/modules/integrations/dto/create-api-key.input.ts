import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateApiKeyInput {
  @Field(() => ID)
  @IsString()
  orgId: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  scope: string;
}
