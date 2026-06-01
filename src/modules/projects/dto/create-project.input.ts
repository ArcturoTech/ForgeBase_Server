import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class CreateProjectInput {
  @Field(() => ID)
  @IsString()
  orgId: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  slug: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  client?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  budgetCents?: number;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  deadline?: Date;
}
