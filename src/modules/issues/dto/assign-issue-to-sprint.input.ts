import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@InputType()
export class AssignIssueToSprintInput {
  @Field(() => ID)
  @IsUUID()
  issueId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  sprintId?: string;
}
