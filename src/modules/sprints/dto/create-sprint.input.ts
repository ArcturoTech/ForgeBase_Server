import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class CreateSprintInput {
  @Field(() => ID)
  @IsString()
  projectId: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  number: number;

  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  code?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  targetPoints?: number;
}
