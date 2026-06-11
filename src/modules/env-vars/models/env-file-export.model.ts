import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EnvFileExport {
  @Field()
  category: string;

  @Field()
  filename: string;

  @Field()
  content: string;
}
