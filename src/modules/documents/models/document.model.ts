import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { DocCategory, DocStatus } from '@/common/graphql/enums';
import { DocumentComment } from './document-comment.model';

@ObjectType()
export class Document {
  @Field(() => ID)
  id: string;

  @Field()
  orgId: string;

  @Field({ nullable: true })
  projectId?: string;

  @Field({ nullable: true })
  parentId?: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  authorId?: string;

  @Field(() => Int)
  version: number;

  @Field(() => DocStatus)
  status: DocStatus;

  @Field(() => DocCategory)
  category: DocCategory;

  @Field(() => GraphQLJSON, { nullable: true })
  body?: Record<string, unknown>;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [DocumentComment])
  comments?: DocumentComment[];
}
