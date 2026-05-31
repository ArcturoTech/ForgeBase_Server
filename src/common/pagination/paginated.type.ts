import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export interface PaginatedInterface<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export function Paginated<T>(classRef: Type<T>): Type<PaginatedInterface<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements PaginatedInterface<T> {
    @Field(() => [classRef])
    data: T[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;

    @Field()
    hasNextPage: boolean;
  }

  return PaginatedType as Type<PaginatedInterface<T>>;
}
