import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsISO8601, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

@InputType()
export class UpdatePersonalSprintInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsISO8601()
  startDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsISO8601()
  endDate?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  targetPoints?: number;
}
