import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PersonalTaskStatus, Priority } from '@/common/graphql/enums';

@InputType()
export class CreatePersonalTaskInput {
  @Field(() => ID)
  @IsUUID()
  orgId: string;

  @Field()
  @IsString()
  title: string;

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
}
