import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class UpdateProjectMemberInput {
  @Field(() => ID)
  @IsString()
  projectId: string;

  @Field(() => ID)
  @IsString()
  userId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  role?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  hours?: number;
}
