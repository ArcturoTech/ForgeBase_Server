import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { InvoiceStatus } from '@/common/graphql/enums';

@ObjectType()
export class Invoice {
  @Field(() => ID)
  id: string;

  @Field()
  orgId: string;

  @Field({ nullable: true })
  projectId?: string;

  @Field()
  number: string;

  @Field()
  clientName: string;

  @Field(() => Int)
  amountCents: number;

  @Field({ nullable: true })
  issueDate?: Date;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field(() => InvoiceStatus)
  status: InvoiceStatus;

  @Field({ nullable: true })
  paidAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
