import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString, Min } from 'class-validator';

@InputType()
export class MoveIssueInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field(() => ID)
  @IsString()
  toColumnId: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  position: number;
}
