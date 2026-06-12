import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DocumentShare {
  @Field(() => ID)
  id: string;

  @Field()
  documentId: string;

  @Field()
  sharedWithUserId: string;

  @Field()
  grantedById: string;

  @Field()
  createdAt: Date;
}
