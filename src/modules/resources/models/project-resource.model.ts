import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ResourceType } from '@/common/graphql/enums';

@ObjectType()
export class ProjectResource {
  @Field(() => ID)
  id: string;

  @Field()
  projectId: string;

  @Field(() => ResourceType)
  type: ResourceType;

  @Field()
  label: string;

  @Field()
  url: string;

  @Field()
  createdAt: Date;
}
