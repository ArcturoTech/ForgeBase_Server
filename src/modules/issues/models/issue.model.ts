import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { IssueType, Priority } from '@/common/graphql/enums';
import { User } from '@/users/models/user.model';
import { Label } from './label.model';
import { Subtask } from './subtask.model';
import { IssueComment } from './issue-comment.model';

@ObjectType()
export class Issue {
  @Field(() => ID)
  id: string;

  @Field()
  orgId: string;

  @Field()
  boardId: string;

  @Field()
  columnId: string;

  @Field({ nullable: true })
  sprintId?: string;

  @Field()
  key: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  points?: number;

  @Field(() => IssueType)
  type: IssueType;

  @Field(() => Priority)
  priority: Priority;

  @Field(() => Int)
  position: number;

  @Field()
  urgent: boolean;

  @Field()
  done: boolean;

  @Field()
  standalone: boolean;

  @Field({ nullable: true })
  epic?: string;

  @Field({ nullable: true })
  parentId?: string;

  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  goal?: string;

  @Field({ nullable: true })
  reporterId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Issue], { nullable: true })
  children?: Issue[];

  @Field(() => [User])
  assignees?: User[];

  @Field(() => [Label])
  labels?: Label[];

  @Field(() => [Subtask])
  subtasks?: Subtask[];

  @Field(() => [IssueComment])
  comments?: IssueComment[];
}
