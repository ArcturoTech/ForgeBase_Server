import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '@/users/models/user.model';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  channelId: string;

  @Field()
  authorId: string;

  @Field()
  body: string;

  @Field({ nullable: true })
  replyToId?: string;

  @Field({ nullable: true })
  editedAt?: Date;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field()
  createdAt: Date;

  @Field(() => User, { nullable: true })
  author?: User;
}
