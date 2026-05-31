import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from '@/common/graphql/enums';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  email: string;

  @Field(() => Role)
  role: Role;

  @Field()
  emailVerified: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
