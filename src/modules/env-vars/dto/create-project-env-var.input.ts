import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { EnvScope } from '@/common/graphql/enums';

@InputType()
export class CreateProjectEnvVarInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @Field(() => EnvScope)
  @IsEnum(EnvScope)
  scope: EnvScope;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  @Matches(/^[A-Z][A-Z0-9_]*$/, {
    message: 'A chave deve conter apenas letras maiúsculas, números e underscore',
  })
  key: string;

  @Field()
  @IsString()
  @MaxLength(8192)
  value: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isSecret?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(280)
  description?: string;
}
