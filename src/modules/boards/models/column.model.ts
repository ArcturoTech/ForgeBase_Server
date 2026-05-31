import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Column {
  @Field(() => ID)
  id: string;

  @Field()
  boardId: string;

  @Field()
  name: string;

  @Field(() => Int)
  position: number;

  @Field(() => Int, { nullable: true })
  wipLimit?: number;

  @Field()
  color: string;
}
