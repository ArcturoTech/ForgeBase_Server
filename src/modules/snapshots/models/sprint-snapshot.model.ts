import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SprintSnapshot {
  @Field(() => ID)
  id: string;

  @Field()
  capturedOn: Date;

  @Field(() => Int)
  remainingPoints: number;

  @Field(() => Int)
  totalPoints: number;
}
