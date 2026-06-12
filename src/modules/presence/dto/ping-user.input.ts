import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class PingUserInput {
  @Field(() => ID)
  @IsUUID()
  orgId: string;

  @Field(() => ID)
  @IsUUID()
  targetUserId: string;
}
