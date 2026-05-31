import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '@/users/models/user.model';

@ObjectType()
export class IssueComment {
  @Field(() => ID)
  id: string;

  @Field()
  issueId: string;

  @Field()
  authorId: string;

  @Field()
  body: string;

  @Field()
  createdAt: Date;

  @Field(() => User, { nullable: true })
  author?: User;
}
