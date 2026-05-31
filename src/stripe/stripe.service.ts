import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { SubscriptionStatus } from '@/prisma/prisma-client';
import Stripe from 'stripe';

interface StripeSubscriptionShape {
  id: string;
  customer: string;
  status: string;
  current_period_end: number;
  items: { data: Array<{ price: { id: string } }> };
}

@Injectable()
export class StripeService {
  private readonly stripe?: InstanceType<typeof Stripe>;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const secretKey = this.config.get<string>('stripe.secretKey');
    if (secretKey) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2026-05-27.dahlia',
        typescript: true,
      });
    }
  }

  private getClient(): InstanceType<typeof Stripe> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe não está configurado');
    }
    return this.stripe;
  }

  async createCheckoutSession(userId: string, email: string, priceId: string) {
    const stripe = this.getClient();
    const subscription = await this.prisma.subscription.findUnique({ where: { userId } });
    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({ email });
      customerId = customer.id;
      await this.prisma.subscription.upsert({
        where: { userId },
        create: { userId, stripeCustomerId: customerId },
        update: { stripeCustomerId: customerId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${this.config.get('app.frontendUrl')}/billing?success=true`,
      cancel_url: `${this.config.get('app.frontendUrl')}/billing?canceled=true`,
    });

    return { url: session.url };
  }

  async createPortalSession(userId: string) {
    const stripe = this.getClient();
    const subscription = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!subscription?.stripeCustomerId) {
      throw new BadRequestException('No Stripe customer found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${this.config.get('app.frontendUrl')}/billing`,
    });

    return { url: session.url };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const event = this.constructWebhookEvent(payload, signature);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as unknown as StripeSubscriptionShape;
        await this.prisma.subscription.updateMany({
          where: { stripeCustomerId: sub.customer },
          data: {
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
            status: sub.status.toUpperCase() as SubscriptionStatus,
          },
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as unknown as StripeSubscriptionShape;
        await this.prisma.subscription.updateMany({
          where: { stripeCustomerId: sub.customer },
          data: { status: 'CANCELED', plan: 'FREE' },
        });
        break;
      }
    }

    return { received: true };
  }

  private constructWebhookEvent(payload: Buffer, signature: string) {
    const stripe = this.getClient();
    try {
      return stripe.webhooks.constructEvent(
        payload,
        signature,
        this.config.get<string>('stripe.webhookSecret')!,
      );
    } catch {
      throw new BadRequestException('Invalid Stripe webhook signature');
    }
  }
}
