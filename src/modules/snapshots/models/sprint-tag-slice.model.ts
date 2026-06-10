import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SprintTagSlice {
  @Field()
  tag: string;

  @Field(() => Int)
  points: number;

  @Field(() => Int)
  issues: number;
}
