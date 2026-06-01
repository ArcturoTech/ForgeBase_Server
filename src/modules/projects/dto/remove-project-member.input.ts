import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class RemoveProjectMemberInput {
  @Field(() => ID)
  @IsString()
  projectId: string;

  @Field(() => ID)
  @IsString()
  userId: string;
}
