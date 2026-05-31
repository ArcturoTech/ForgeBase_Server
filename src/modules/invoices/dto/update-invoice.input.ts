import { Field, ID, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CreateInvoiceInput } from './create-invoice.input';

@InputType()
export class UpdateInvoiceInput extends PartialType(
  OmitType(CreateInvoiceInput, ['orgId', 'number'] as const),
) {
  @Field(() => ID)
  @IsString()
  id: string;
}
