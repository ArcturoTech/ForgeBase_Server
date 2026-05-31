import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { ApiKey } from './models/api-key.model';
import { Webhook } from './models/webhook.model';
import { WebhookDelivery } from './models/webhook-delivery.model';
import { IntegrationStats } from './models/integration-stats.model';
import { CreateApiKeyInput } from './dto/create-api-key.input';
import { CreateWebhookInput } from './dto/create-webhook.input';
import { UpdateWebhookInput } from './dto/update-webhook.input';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver(() => Webhook)
export class IntegrationsResolver {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Query(() => [ApiKey])
  @UseGuards(GqlAuthGuard)
  listApiKeys(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
  ): Promise<ApiKey[]> {
    return this.integrationsService.listApiKeys(user.id, orgId) as Promise<ApiKey[]>;
  }

  @Query(() => [Webhook])
  @UseGuards(GqlAuthGuard)
  listWebhooks(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
  ): Promise<Webhook[]> {
    return this.integrationsService.listWebhooks(user.id, orgId) as Promise<Webhook[]>;
  }

  @Query(() => [WebhookDelivery])
  @UseGuards(GqlAuthGuard)
  listWebhookDeliveries(
    @CurrentUser() user: AuthenticatedUser,
    @Args('webhookId', { type: () => ID }) webhookId: string,
  ): Promise<WebhookDelivery[]> {
    return this.integrationsService.listWebhookDeliveries(
      user.id,
      webhookId,
    ) as Promise<WebhookDelivery[]>;
  }

  @Query(() => IntegrationStats)
  @UseGuards(GqlAuthGuard)
  findIntegrationStats(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
  ): Promise<IntegrationStats> {
    return this.integrationsService.findIntegrationStats(user.id, orgId);
  }

  @Mutation(() => ApiKey)
  @UseGuards(GqlAuthGuard)
  createApiKey(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateApiKeyInput,
  ): Promise<ApiKey> {
    return this.integrationsService.createApiKey(user.id, input) as Promise<ApiKey>;
  }

  @Mutation(() => ApiKey)
  @UseGuards(GqlAuthGuard)
  revokeApiKey(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ApiKey> {
    return this.integrationsService.revokeApiKey(user.id, id) as Promise<ApiKey>;
  }

  @Mutation(() => Webhook)
  @UseGuards(GqlAuthGuard)
  createWebhook(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateWebhookInput,
  ): Promise<Webhook> {
    return this.integrationsService.createWebhook(user.id, input) as Promise<Webhook>;
  }

  @Mutation(() => Webhook)
  @UseGuards(GqlAuthGuard)
  updateWebhook(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: UpdateWebhookInput,
  ): Promise<Webhook> {
    return this.integrationsService.updateWebhook(user.id, input) as Promise<Webhook>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeWebhook(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.integrationsService.removeWebhook(user.id, id);
  }
}
