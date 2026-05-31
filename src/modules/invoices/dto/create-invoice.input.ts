import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { InvoiceStatus } from '@/common/graphql/enums';

@InputType()
export class CreateInvoiceInput {
  @Field(() => ID)
  @IsString()
  orgId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  projectId?: string;

  @Field()
  @IsString()
  number: string;

  @Field()
  @IsString()
  clientName: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  amountCents: number;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  issueDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  dueDate?: Date;

  @Field(() => InvoiceStatus, { nullable: true })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;
}
