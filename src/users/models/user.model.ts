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

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  jobTitle?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field()
  theme: string;

  @Field()
  locale: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
