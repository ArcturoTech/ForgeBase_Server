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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const integrations_service_1 = require("./integrations.service");
const api_key_model_1 = require("./models/api-key.model");
const webhook_model_1 = require("./models/webhook.model");
const webhook_delivery_model_1 = require("./models/webhook-delivery.model");
const integration_stats_model_1 = require("./models/integration-stats.model");
const create_api_key_input_1 = require("./dto/create-api-key.input");
const create_webhook_input_1 = require("./dto/create-webhook.input");
const update_webhook_input_1 = require("./dto/update-webhook.input");
const gql_auth_guard_1 = require("../../common/guards/gql-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let IntegrationsResolver = class IntegrationsResolver {
    integrationsService;
    constructor(integrationsService) {
        this.integrationsService = integrationsService;
    }
    listApiKeys(user, orgId) {
        return this.integrationsService.listApiKeys(user.id, orgId);
    }
    listWebhooks(user, orgId) {
        return this.integrationsService.listWebhooks(user.id, orgId);
    }
    listWebhookDeliveries(user, webhookId) {
        return this.integrationsService.listWebhookDeliveries(user.id, webhookId);
    }
    findIntegrationStats(user, orgId) {
        return this.integrationsService.findIntegrationStats(user.id, orgId);
    }
    createApiKey(user, input) {
        return this.integrationsService.createApiKey(user.id, input);
    }
    revokeApiKey(user, id) {
        return this.integrationsService.revokeApiKey(user.id, id);
    }
    createWebhook(user, input) {
        return this.integrationsService.createWebhook(user.id, input);
    }
    updateWebhook(user, input) {
        return this.integrationsService.updateWebhook(user.id, input);
    }
    removeWebhook(user, id) {
        return this.integrationsService.removeWebhook(user.id, id);
    }
};
exports.IntegrationsResolver = IntegrationsResolver;
__decorate([
    (0, graphql_1.Query)(() => [api_key_model_1.ApiKey]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IntegrationsResolver.prototype, "listApiKeys", null);
__decorate([
    (0, graphql_1.Query)(() => [webhook_model_1.Webhook]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IntegrationsResolver.prototype, "listWebhooks", null);
__decorate([
    (0, graphql_1.Query)(() => [webhook_delivery_model_1.WebhookDelivery]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('webhookId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IntegrationsResolver.prototype, "listWebhookDeliveries", null);
__decorate([
    (0, graphql_1.Query)(() => integration_stats_model_1.IntegrationStats),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IntegrationsResolver.prototype, "findIntegrationStats", null);
__decorate([
    (0, graphql_1.Mutation)(() => api_key_model_1.ApiKey),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_api_key_input_1.CreateApiKeyInput]),
    __metadata("design:returntype", Promise)
], IntegrationsResolver.prototype, "createApiKey", null);
__decorate([
    (0, graphql_1.Mutation)(() => api_key_model_1.ApiKey),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IntegrationsResolver.prototype, "revokeApiKey", null);
__decorate([
    (0, graphql_1.Mutation)(() => webhook_model_1.Webhook),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_webhook_input_1.CreateWebhookInput]),
    __metadata("design:returntype", Promise)
], IntegrationsResolver.prototype, "createWebhook", null);
__decorate([
    (0, graphql_1.Mutation)(() => webhook_model_1.Webhook),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_webhook_input_1.UpdateWebhookInput]),
    __metadata("design:returntype", Promise)
], IntegrationsResolver.prototype, "updateWebhook", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IntegrationsResolver.prototype, "removeWebhook", null);
exports.IntegrationsResolver = IntegrationsResolver = __decorate([
    (0, graphql_1.Resolver)(() => webhook_model_1.Webhook),
    __metadata("design:paramtypes", [integrations_service_1.IntegrationsService])
], IntegrationsResolver);
//# sourceMappingURL=integrations.resolver.js.map