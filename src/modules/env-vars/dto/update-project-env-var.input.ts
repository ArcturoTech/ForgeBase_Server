import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpdateProjectEnvVarInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(8192)
  value?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isSecret?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(280)
  description?: string;
}
