import { Field, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum ClosePersonalSprintAction {
  MOVE_TO_BACKLOG = 'MOVE_TO_BACKLOG',
  MARK_DONE = 'MARK_DONE',
  CLOSE_INCOMPLETE = 'CLOSE_INCOMPLETE',
}

registerEnumType(ClosePersonalSprintAction, { name: 'ClosePersonalSprintAction' });

@InputType()
export class ClosePersonalSprintInput {
  @Field(() => ID)
  @IsUUID()
  sprintId: string;

  @Field(() => ClosePersonalSprintAction, { nullable: true })
  @IsOptional()
  @IsEnum(ClosePersonalSprintAction)
  action?: ClosePersonalSprintAction;
}
