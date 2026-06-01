import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ProjectStatus } from '@/common/graphql/enums';

@InputType()
export class UpdateProjectInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  slug?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  client?: string;

  @Field(() => ProjectStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  progress?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  budgetCents?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  spentPct?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  dueLabel?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  deadline?: Date;
}
