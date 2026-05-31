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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const tenancy_service_1 = require("../../common/tenancy/tenancy.service");
const enums_1 = require("../../common/graphql/enums");
function generateKeyPrefix() {
    const suffix = (0, crypto_1.randomBytes)(16).toString('hex').slice(0, 5);
    return `fb_live_${suffix}`;
}
let IntegrationsService = class IntegrationsService {
    prisma;
    tenancy;
    constructor(prisma, tenancy) {
        this.prisma = prisma;
        this.tenancy = tenancy;
    }
    async listApiKeys(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        return this.prisma.apiKey.findMany({
            where: { orgId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createApiKey(userId, input) {
        await this.tenancy.assertOrgMembership(userId, input.orgId);
        return this.prisma.apiKey.create({
            data: {
                orgId: input.orgId,
                name: input.name,
                scope: input.scope,
                prefix: generateKeyPrefix(),
            },
        });
    }
    async revokeApiKey(userId, id) {
        const apiKey = await this.loadApiKeyOrThrow(id);
        await this.tenancy.assertOrgMembership(userId, apiKey.orgId);
        return this.prisma.apiKey.update({
            where: { id },
            data: { status: enums_1.ApiKeyStatus.REVOKED },
        });
    }
    async listWebhooks(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        return this.prisma.webhook.findMany({
            where: { orgId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createWebhook(userId, input) {
        await this.tenancy.assertOrgMembership(userId, input.orgId);
        return this.prisma.webhook.create({
            data: {
                orgId: input.orgId,
                url: input.url,
                events: input.events,
            },
        });
    }
    async updateWebhook(userId, input) {
        const webhook = await this.loadWebhookOrThrow(input.id);
        await this.tenancy.assertOrgMembership(userId, webhook.orgId);
        const { id, ...data } = input;
        return this.prisma.webhook.update({ where: { id }, data });
    }
    async removeWebhook(userId, id) {
        const webhook = await this.loadWebhookOrThrow(id);
        await this.tenancy.assertOrgMembership(userId, webhook.orgId);
        await this.prisma.webhook.delete({ where: { id } });
        return true;
    }
    async listWebhookDeliveries(userId, webhookId) {
        const webhook = await this.loadWebhookOrThrow(webhookId);
        await this.tenancy.assertOrgMembership(userId, webhook.orgId);
        return this.prisma.webhookDelivery.findMany({
            where: { webhookId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async findIntegrationStats(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        const [activeApiKeys, webhooks, failingWebhooks] = await this.prisma.$transaction([
            this.prisma.apiKey.count({ where: { orgId, status: enums_1.ApiKeyStatus.ACTIVE } }),
            this.prisma.webhook.findMany({ where: { orgId }, select: { successRate: true } }),
            this.prisma.webhook.count({ where: { orgId, status: enums_1.WebhookStatus.FAILING } }),
        ]);
        const totalWebhooks = webhooks.length;
        const averageSuccessRate = totalWebhooks
            ? webhooks.reduce((sum, webhook) => sum + webhook.successRate, 0) / totalWebhooks
            : 0;
        return { activeApiKeys, totalWebhooks, failingWebhooks, averageSuccessRate };
    }
    async loadApiKeyOrThrow(id) {
        const apiKey = await this.prisma.apiKey.findUnique({ where: { id } });
        if (!apiKey)
            throw new common_1.NotFoundException('Chave de API não encontrada');
        return apiKey;
    }
    async loadWebhookOrThrow(id) {
        const webhook = await this.prisma.webhook.findUnique({ where: { id } });
        if (!webhook)
            throw new common_1.NotFoundException('Webhook não encontrado');
        return webhook;
    }
};
exports.IntegrationsService = IntegrationsService;
exports.IntegrationsService = IntegrationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenancy_service_1.TenancyService])
], IntegrationsService);
//# sourceMappingURL=integrations.service.js.map