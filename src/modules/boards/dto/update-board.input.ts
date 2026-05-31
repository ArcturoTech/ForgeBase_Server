import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateBoardInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field()
  @IsString()
  name: string;
}
