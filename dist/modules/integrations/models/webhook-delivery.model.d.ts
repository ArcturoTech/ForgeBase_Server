export declare class WebhookDelivery {
    id: string;
    webhookId: string;
    event: string;
    statusCode: number;
    durationMs: number;
    target: string;
    failed: boolean;
    retryLabel?: string;
    createdAt: Date;
}
