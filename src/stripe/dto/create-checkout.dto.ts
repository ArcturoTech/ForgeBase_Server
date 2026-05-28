import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCheckoutDto {
  @ApiProperty({ description: 'Stripe Price ID' })
  @IsString()
  @IsNotEmpty()
  priceId: string;
}
