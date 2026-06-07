import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserPreferencesInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsIn(['light', 'dark'])
  theme?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsIn(['pt-BR', 'en-US', 'es-ES'])
  locale?: string;
}
