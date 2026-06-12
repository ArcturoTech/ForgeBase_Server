import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserPreferencesInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsIn(['light', 'dark', 'system'])
  theme?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsIn(['pt-BR', 'en-US', 'es-ES'])
  locale?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  timezone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  dateFormat?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;
}
