import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EnvScope } from '@/common/graphql/enums';

@ObjectType()
export class ProjectEnvVar {
  @Field(() => ID)
  id: string;

  @Field()
  projectId: string;

  @Field(() => EnvScope)
  scope: EnvScope;

  @Field()
  key: string;

  @Field()
  isSecret: boolean;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  value?: string;

  @Field()
  masked: string;

  @Field()
  updatedAt: Date;
}
