import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Attachment {
  @Field(() => ID)
  id: string;

  @Field()
  orgId: string;

  @Field({ nullable: true })
  targetType?: string;

  @Field({ nullable: true })
  targetId?: string;

  @Field()
  filename: string;

  @Field()
  mimeType: string;

  @Field(() => Int)
  size: number;

  @Field()
  url: string;

  @Field({ nullable: true })
  uploaderId?: string;

  @Field()
  createdAt: Date;
}
