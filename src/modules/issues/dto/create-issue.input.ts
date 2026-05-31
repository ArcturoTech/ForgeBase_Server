import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Priority } from '@/common/graphql/enums';

@InputType()
export class CreateIssueInput {
  @Field(() => ID)
  @IsString()
  orgId: string;

  @Field(() => ID)
  @IsString()
  boardId: string;

  @Field(() => ID)
  @IsString()
  columnId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  sprintId?: string;

  @Field()
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  assigneeIds?: string[];

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  labelIds?: string[];
}
