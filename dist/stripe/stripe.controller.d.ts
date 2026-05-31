import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { StripeService } from './stripe.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import type { AuthenticatedUser } from "../auth/decorators/current-user.decorator";
export declare class StripeController {
    private stripeService;
    constructor(stripeService: StripeService);
    createCheckout(user: AuthenticatedUser, dto: CreateCheckoutDto): Promise<{
        url: string | null;
    }>;
    createPortal(user: AuthenticatedUser): Promise<{
        url: string;
    }>;
    handleWebhook(req: RawBodyRequest<Request>, signature: string): Promise<{
        received: boolean;
    }>;
}
