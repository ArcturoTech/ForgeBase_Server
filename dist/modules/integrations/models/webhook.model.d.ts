import { WebhookStatus } from "../../../common/graphql/enums";
export declare class Webhook {
    id: string;
    url: string;
    events: string[];
    status: WebhookStatus;
    successRate: number;
    lastDeliveryAt?: Date;
    createdAt: Date;
}
