"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_1 = __importDefault(require("stripe"));
let StripeService = class StripeService {
    config;
    prisma;
    stripe;
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
        const secretKey = this.config.get('stripe.secretKey');
        if (secretKey) {
            this.stripe = new stripe_1.default(secretKey, {
                apiVersion: '2026-05-27.dahlia',
                typescript: true,
            });
        }
    }
    getClient() {
        if (!this.stripe) {
            throw new common_1.BadRequestException('Stripe não está configurado');
        }
        return this.stripe;
    }
    async createCheckoutSession(userId, email, priceId) {
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
    async createPortalSession(userId) {
        const stripe = this.getClient();
        const subscription = await this.prisma.subscription.findUnique({ where: { userId } });
        if (!subscription?.stripeCustomerId) {
            throw new common_1.BadRequestException('No Stripe customer found');
        }
        const session = await stripe.billingPortal.sessions.create({
            customer: subscription.stripeCustomerId,
            return_url: `${this.config.get('app.frontendUrl')}/billing`,
        });
        return { url: session.url };
    }
    async handleWebhook(payload, signature) {
        const event = this.constructWebhookEvent(payload, signature);
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const sub = event.data.object;
                await this.prisma.subscription.updateMany({
                    where: { stripeCustomerId: sub.customer },
                    data: {
                        stripeSubscriptionId: sub.id,
                        stripePriceId: sub.items.data[0].price.id,
                        stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
                        status: sub.status.toUpperCase(),
                    },
                });
                break;
            }
            case 'customer.subscription.deleted': {
                const sub = event.data.object;
                await this.prisma.subscription.updateMany({
                    where: { stripeCustomerId: sub.customer },
                    data: { status: 'CANCELED', plan: 'FREE' },
                });
                break;
            }
        }
        return { received: true };
    }
    constructWebhookEvent(payload, signature) {
        const stripe = this.getClient();
        try {
            return stripe.webhooks.constructEvent(payload, signature, this.config.get('stripe.webhookSecret'));
        }
        catch {
            throw new common_1.BadRequestException('Invalid Stripe webhook signature');
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map