import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '@/users/models/user.model';

@ObjectType()
export class DocumentComment {
  @Field(() => ID)
  id: string;

  @Field()
  documentId: string;

  @Field()
  authorId: string;

  @Field()
  body: string;

  @Field()
  resolved: boolean;

  @Field()
  createdAt: Date;

  @Field(() => User, { nullable: true })
  author?: User;
}
