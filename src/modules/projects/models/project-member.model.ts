import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from '@/users/models/user.model';

@ObjectType()
export class ProjectMember {
  @Field(() => ID)
  id: string;

  @Field()
  projectId: string;

  @Field()
  userId: string;

  @Field()
  role: string;

  @Field(() => Int)
  hours: number;

  @Field(() => User)
  user?: User;
}
