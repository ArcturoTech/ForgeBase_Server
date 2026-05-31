import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class UpdateSprintInput {
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
  code?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  endDate?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  targetPoints?: number;
}
