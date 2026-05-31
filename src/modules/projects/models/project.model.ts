import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ProjectStatus } from '@/common/graphql/enums';
import { ProjectMember } from './project-member.model';

@ObjectType()
export class Project {
  @Field(() => ID)
  id: string;

  @Field()
  orgId: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  client?: string;

  @Field(() => ProjectStatus)
  status: ProjectStatus;

  @Field(() => Int)
  progress: number;

  @Field()
  color: string;

  @Field(() => Int)
  budgetCents: number;

  @Field(() => Int)
  spentPct: number;

  @Field({ nullable: true })
  dueLabel?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [ProjectMember])
  members?: ProjectMember[];
}
