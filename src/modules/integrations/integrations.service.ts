import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { ApiKeyStatus, WebhookStatus } from '@/common/graphql/enums';
import { CreateApiKeyInput } from './dto/create-api-key.input';
import { CreateWebhookInput } from './dto/create-webhook.input';
import { UpdateWebhookInput } from './dto/update-webhook.input';

function generateKeyPrefix() {
  const suffix = randomBytes(16).toString('hex').slice(0, 5);
  return `fb_live_${suffix}`;
}

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

  async listApiKeys(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.apiKey.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createApiKey(userId: string, input: CreateApiKeyInput) {
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

  async revokeApiKey(userId: string, id: string) {
    const apiKey = await this.loadApiKeyOrThrow(id);
    await this.tenancy.assertOrgMembership(userId, apiKey.orgId);
    return this.prisma.apiKey.update({
      where: { id },
      data: { status: ApiKeyStatus.REVOKED },
    });
  }

  async listWebhooks(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.webhook.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createWebhook(userId: string, input: CreateWebhookInput) {
    await this.tenancy.assertOrgMembership(userId, input.orgId);
    return this.prisma.webhook.create({
      data: {
        orgId: input.orgId,
        url: input.url,
        events: input.events,
      },
    });
  }

  async updateWebhook(userId: string, input: UpdateWebhookInput) {
    const webhook = await this.loadWebhookOrThrow(input.id);
    await this.tenancy.assertOrgMembership(userId, webhook.orgId);
    const { id, ...data } = input;
    return this.prisma.webhook.update({ where: { id }, data });
  }

  async removeWebhook(userId: string, id: string) {
    const webhook = await this.loadWebhookOrThrow(id);
    await this.tenancy.assertOrgMembership(userId, webhook.orgId);
    await this.prisma.webhook.delete({ where: { id } });
    return true;
  }

  async listWebhookDeliveries(userId: string, webhookId: string) {
    const webhook = await this.loadWebhookOrThrow(webhookId);
    await this.tenancy.assertOrgMembership(userId, webhook.orgId);
    return this.prisma.webhookDelivery.findMany({
      where: { webhookId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async findIntegrationStats(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    const [activeApiKeys, webhooks, failingWebhooks] = await this.prisma.$transaction([
      this.prisma.apiKey.count({ where: { orgId, status: ApiKeyStatus.ACTIVE } }),
      this.prisma.webhook.findMany({ where: { orgId }, select: { successRate: true } }),
      this.prisma.webhook.count({ where: { orgId, status: WebhookStatus.FAILING } }),
    ]);
    const totalWebhooks = webhooks.length;
    const averageSuccessRate = totalWebhooks
      ? webhooks.reduce((sum, webhook) => sum + webhook.successRate, 0) / totalWebhooks
      : 0;
    return { activeApiKeys, totalWebhooks, failingWebhooks, averageSuccessRate };
  }

  private async loadApiKeyOrThrow(id: string) {
    const apiKey = await this.prisma.apiKey.findUnique({ where: { id } });
    if (!apiKey) throw new NotFoundException('Chave de API não encontrada');
    return apiKey;
  }

  private async loadWebhookOrThrow(id: string) {
    const webhook = await this.prisma.webhook.findUnique({ where: { id } });
    if (!webhook) throw new NotFoundException('Webhook não encontrado');
    return webhook;
  }
}
