import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { DocCategory, DocStatus } from '@/common/graphql/enums';

@InputType()
export class CreateDocumentInput {
  @Field(() => ID)
  @IsString()
  orgId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  projectId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  parentId?: string;

  @Field()
  @IsString()
  title: string;

  @Field(() => DocCategory, { nullable: true })
  @IsOptional()
  @IsEnum(DocCategory)
  category?: DocCategory;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;

  @Field(() => DocStatus, { nullable: true })
  @IsOptional()
  @IsEnum(DocStatus)
  status?: DocStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isFolder?: boolean;
}
