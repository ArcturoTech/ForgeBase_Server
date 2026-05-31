import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class AddSubtaskInput {
  @Field(() => ID)
  @IsString()
  issueId: string;

  @Field()
  @IsString()
  label: string;
}

@InputType()
export class AddCommentToIssueInput {
  @Field(() => ID)
  @IsString()
  issueId: string;

  @Field()
  @IsString()
  body: string;
}
