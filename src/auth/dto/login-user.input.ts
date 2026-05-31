import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}
