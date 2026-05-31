import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VelocityPoint {
  @Field(() => Int)
  sprintNumber: number;

  @Field()
  label: string;

  @Field(() => Int)
  planned: number;

  @Field(() => Int)
  done: number;
}
