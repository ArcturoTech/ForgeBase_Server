import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { IsEnum, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { DocCategory, DocStatus } from '@/common/graphql/enums';

@InputType()
export class UpdateDocumentInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field(() => DocCategory, { nullable: true })
  @IsOptional()
  @IsEnum(DocCategory)
  category?: DocCategory;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  parentId?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsObject()
  body?: Record<string, unknown>;

  @Field(() => DocStatus, { nullable: true })
  @IsOptional()
  @IsEnum(DocStatus)
  status?: DocStatus;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;
}
