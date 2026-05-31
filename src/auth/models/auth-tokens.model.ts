import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthTokens {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
