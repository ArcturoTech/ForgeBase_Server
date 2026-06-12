import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { PersonalTaskStatus, Priority } from '@/common/graphql/enums';

@InputType()
export class UpdatePersonalTaskInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field(() => PersonalTaskStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PersonalTaskStatus)
  status?: PersonalTaskStatus;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @Field({ nullable: true })
  @IsOptional()
  dueDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  columnKey?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  position?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID()
  sprintId?: string | null;
}
