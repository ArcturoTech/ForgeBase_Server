import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AssignUserToIssueInput {
  @Field(() => ID)
  @IsUUID()
  issueId: string;

  @Field(() => ID)
  @IsUUID()
  userId: string;
}
