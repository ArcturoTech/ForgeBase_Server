import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '@/users/models/user.model';

@ObjectType()
export class Activity {
  @Field(() => ID)
  id: string;

  @Field()
  action: string;

  @Field({ nullable: true })
  targetType?: string;

  @Field({ nullable: true })
  targetId?: string;

  @Field()
  createdAt: Date;

  @Field(() => User, { nullable: true })
  actor?: User;
}
