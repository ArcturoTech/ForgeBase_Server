import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { IssueType, Priority } from '@/common/graphql/enums';

@InputType()
export class UpdateIssueInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number;

  @Field(() => IssueType, { nullable: true })
  @IsOptional()
  @IsEnum(IssueType)
  type?: IssueType;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  parentId?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  dueDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  goal?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  urgent?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  done?: boolean;
}
