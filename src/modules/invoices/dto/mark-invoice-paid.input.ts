import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class MarkInvoicePaidInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  paidAt?: Date;
}
