import { ConfigService } from '@nestjs/config';
import { PrismaService } from "../prisma/prisma.service";
export declare class StripeService {
    private config;
    private prisma;
    private readonly stripe?;
    constructor(config: ConfigService, prisma: PrismaService);
    private getClient;
    createCheckoutSession(userId: string, email: string, priceId: string): Promise<{
        url: string | null;
    }>;
    createPortalSession(userId: string): Promise<{
        url: string;
    }>;
    handleWebhook(payload: Buffer, signature: string): Promise<{
        received: boolean;
    }>;
    private constructWebhookEvent;
}
