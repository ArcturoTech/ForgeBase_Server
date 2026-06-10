import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IssueType } from '@/common/graphql/enums';

/** Owner-facing view of a project's intake form (returned to authenticated members). */
@ObjectType()
export class IntakeForm {
  @Field(() => ID)
  id: string;

  @Field()
  token: string;

  @Field()
  projectId: string;

  @Field()
  title: string;

  @Field(() => IssueType)
  defaultType: IssueType;

  @Field()
  active: boolean;

  @Field(() => Date)
  createdAt: Date;
}

/** Public, no-login view of a form (only what the external page needs to render). */
@ObjectType()
export class PublicIntakeForm {
  @Field()
  token: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  projectName: string;

  @Field()
  orgName: string;

  @Field(() => IssueType)
  defaultType: IssueType;
}

/** Result of a public submission. Intentionally minimal — no internal data is leaked. */
@ObjectType()
export class IntakeSubmissionResult {
  @Field()
  ok: boolean;
}
