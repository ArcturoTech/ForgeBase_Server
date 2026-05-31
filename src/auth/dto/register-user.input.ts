import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;
}
