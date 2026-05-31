import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateBoardInput {
  @Field(() => ID)
  @IsString()
  projectId: string;

  @Field()
  @IsString()
  name: string;
}
