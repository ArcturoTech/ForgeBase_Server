import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Priority } from '@/common/graphql/enums';

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

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  urgent?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  done?: boolean;
}
