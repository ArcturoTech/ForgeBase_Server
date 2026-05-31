import {
  Body, Controller, Headers, Post,
  Req, UseGuards,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { StripeService } from './stripe.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  @ApiOperation({ summary: 'Create a Stripe checkout session' })
  createCheckout(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCheckoutDto) {
    return this.stripeService.createCheckoutSession(user.id, user.email, dto.priceId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('portal')
  @ApiOperation({ summary: 'Create a Stripe billing portal session' })
  createPortal(@CurrentUser() user: AuthenticatedUser) {
    return this.stripeService.createPortalSession(user.id);
  }

  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.stripeService.handleWebhook(req.rawBody!, signature);
  }
}
