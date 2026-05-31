import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class CreateColumnInput {
  @Field()
  @IsString()
  boardId: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  position: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  wipLimit?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  color?: string;
}
