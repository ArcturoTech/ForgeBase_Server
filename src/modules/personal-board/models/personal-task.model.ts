import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { PersonalTaskStatus, Priority } from '@/common/graphql/enums';
import { PersonalSprint } from './personal-sprint.model';

@ObjectType()
export class PersonalTask {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => PersonalTaskStatus)
  status: PersonalTaskStatus;

  @Field(() => Priority)
  priority: Priority;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field()
  columnKey: string;

  @Field(() => Int)
  position: number;

  @Field()
  isSprintMapped: boolean;

  @Field({ nullable: true })
  sprintId?: string;

  @Field(() => PersonalSprint, { nullable: true })
  sprint?: PersonalSprint;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
