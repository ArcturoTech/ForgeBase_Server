import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column } from './column.model';

@ObjectType()
export class Board {
  @Field(() => ID)
  id: string;

  @Field()
  projectId: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field(() => [Column])
  columns?: Column[];
}
