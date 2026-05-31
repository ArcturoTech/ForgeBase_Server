import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Label {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  hue: number;
}
