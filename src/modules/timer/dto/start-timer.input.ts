import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@InputType()
export class StartTimerInput {
  @Field(() => ID)
  @IsUUID()
  orgId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  issueId?: string;
}
