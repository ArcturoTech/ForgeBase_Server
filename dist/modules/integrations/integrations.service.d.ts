import { PrismaService } from "../../prisma/prisma.service";
import { TenancyService } from "../../common/tenancy/tenancy.service";
import { CreateApiKeyInput } from './dto/create-api-key.input';
import { CreateWebhookInput } from './dto/create-webhook.input';
import { UpdateWebhookInput } from './dto/update-webhook.input';
export declare class IntegrationsService {
    private readonly prisma;
    private readonly tenancy;
    constructor(prisma: PrismaService, tenancy: TenancyService);
    listApiKeys(userId: string, orgId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("generated/prisma").$Enums.ApiKeyStatus;
        scope: string;
        prefix: string;
        lastUsedAt: Date | null;
        callCount: number;
    }[]>;
    createApiKey(userId: string, input: CreateApiKeyInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("generated/prisma").$Enums.ApiKeyStatus;
        scope: string;
        prefix: string;
        lastUsedAt: Date | null;
        callCount: number;
    }>;
    revokeApiKey(userId: string, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("generated/prisma").$Enums.ApiKeyStatus;
        scope: string;
        prefix: string;
        lastUsedAt: Date | null;
        callCount: number;
    }>;
    listWebhooks(userId: string, orgId: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("generated/prisma").$Enums.WebhookStatus;
        url: string;
        events: string[];
        successRate: number;
        lastDeliveryAt: Date | null;
    }[]>;
    createWebhook(userId: string, input: CreateWebhookInput): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("generated/prisma").$Enums.WebhookStatus;
        url: string;
        events: string[];
        successRate: number;
        lastDeliveryAt: Date | null;
    }>;
    updateWebhook(userId: string, input: UpdateWebhookInput): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("generated/prisma").$Enums.WebhookStatus;
        url: string;
        events: string[];
        successRate: number;
        lastDeliveryAt: Date | null;
    }>;
    removeWebhook(userId: string, id: string): Promise<boolean>;
    listWebhookDeliveries(userId: string, webhookId: string): Promise<{
        id: string;
        createdAt: Date;
        webhookId: string;
        event: string;
        statusCode: number;
        durationMs: number;
        target: string;
        failed: boolean;
        retryLabel: string | null;
    }[]>;
    findIntegrationStats(userId: string, orgId: string): Promise<{
        activeApiKeys: number;
        totalWebhooks: number;
        failingWebhooks: number;
        averageSuccessRate: number;
    }>;
    private loadApiKeyOrThrow;
    private loadWebhookOrThrow;
}
