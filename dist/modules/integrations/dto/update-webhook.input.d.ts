import { WebhookStatus } from "../../../common/graphql/enums";
export declare class UpdateWebhookInput {
    id: string;
    url?: string;
    events?: string[];
    status?: WebhookStatus;
}
