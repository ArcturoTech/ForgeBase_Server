import { IntegrationsService } from './integrations.service';
import { ApiKey } from './models/api-key.model';
import { Webhook } from './models/webhook.model';
import { WebhookDelivery } from './models/webhook-delivery.model';
import { IntegrationStats } from './models/integration-stats.model';
import { CreateApiKeyInput } from './dto/create-api-key.input';
import { CreateWebhookInput } from './dto/create-webhook.input';
import { UpdateWebhookInput } from './dto/update-webhook.input';
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
export declare class IntegrationsResolver {
    private readonly integrationsService;
    constructor(integrationsService: IntegrationsService);
    listApiKeys(user: AuthenticatedUser, orgId: string): Promise<ApiKey[]>;
    listWebhooks(user: AuthenticatedUser, orgId: string): Promise<Webhook[]>;
    listWebhookDeliveries(user: AuthenticatedUser, webhookId: string): Promise<WebhookDelivery[]>;
    findIntegrationStats(user: AuthenticatedUser, orgId: string): Promise<IntegrationStats>;
    createApiKey(user: AuthenticatedUser, input: CreateApiKeyInput): Promise<ApiKey>;
    revokeApiKey(user: AuthenticatedUser, id: string): Promise<ApiKey>;
    createWebhook(user: AuthenticatedUser, input: CreateWebhookInput): Promise<Webhook>;
    updateWebhook(user: AuthenticatedUser, input: UpdateWebhookInput): Promise<Webhook>;
    removeWebhook(user: AuthenticatedUser, id: string): Promise<boolean>;
}
