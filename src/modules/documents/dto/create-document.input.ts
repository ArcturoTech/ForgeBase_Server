import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { DocStatus } from '@/common/graphql/enums';

@InputType()
export class CreateDocumentInput {
  @Field(() => ID)
  @IsString()
  orgId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  projectId?: string;

  @Field()
  @IsString()
  title: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;

  @Field(() => DocStatus, { nullable: true })
  @IsOptional()
  @IsEnum(DocStatus)
  status?: DocStatus;
}
