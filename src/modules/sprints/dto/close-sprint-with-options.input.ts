import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { CloseSprintAction } from '@/common/graphql/enums';

@InputType()
export class CloseSprintWithOptionsInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field(() => CloseSprintAction)
  @IsEnum(CloseSprintAction)
  action: CloseSprintAction;
}
