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
exports.NotificationsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const notifications_service_1 = require("./notifications.service");
const notification_model_1 = require("./models/notification.model");
const notification_preference_model_1 = require("./models/notification-preference.model");
const create_notification_input_1 = require("./dto/create-notification.input");
const update_notification_prefs_input_1 = require("./dto/update-notification-prefs.input");
const pubsub_module_1 = require("../../common/pubsub/pubsub.module");
const gql_auth_guard_1 = require("../../common/guards/gql-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let NotificationsResolver = class NotificationsResolver {
    notificationsService;
    pubSub;
    constructor(notificationsService, pubSub) {
        this.notificationsService = notificationsService;
        this.pubSub = pubSub;
    }
    listNotifications(user, orgId) {
        return this.notificationsService.listNotifications(user.id, orgId);
    }
    markNotificationRead(user, id) {
        return this.notificationsService.markNotificationRead(user.id, id);
    }
    removeNotification(user, id) {
        return this.notificationsService.removeNotification(user.id, id);
    }
    markAllNotificationsRead(user, orgId) {
        return this.notificationsService.markAllNotificationsRead(user.id, orgId);
    }
    createNotification(user, input) {
        return this.notificationsService.createNotification(user.id, input);
    }
    findMyNotificationPreferences(user) {
        return this.notificationsService.findNotificationPreferencesByUserId(user.id);
    }
    updateNotificationPreferences(user, input) {
        return this.notificationsService.updateNotificationPreferencesByUserId(user.id, input);
    }
    notificationReceived(_userId) {
        return this.pubSub.asyncIterator(notifications_service_1.NOTIFICATION_EVENTS.received);
    }
};
exports.NotificationsResolver = NotificationsResolver;
__decorate([
    (0, graphql_1.Query)(() => [notification_model_1.Notification]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "listNotifications", null);
__decorate([
    (0, graphql_1.Mutation)(() => notification_model_1.Notification),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "markNotificationRead", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "removeNotification", null);
__decorate([
    (0, graphql_1.Mutation)(() => graphql_1.Int),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "markAllNotificationsRead", null);
__decorate([
    (0, graphql_1.Mutation)(() => notification_model_1.Notification),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_notification_input_1.CreateNotificationInput]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "createNotification", null);
__decorate([
    (0, graphql_1.Query)(() => notification_preference_model_1.NotificationPreference),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "findMyNotificationPreferences", null);
__decorate([
    (0, graphql_1.Mutation)(() => notification_preference_model_1.NotificationPreference),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_notification_prefs_input_1.UpdateNotificationPrefsInput]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "updateNotificationPreferences", null);
__decorate([
    (0, graphql_1.Subscription)(() => notification_model_1.Notification, {
        filter: (payload, variables) => payload.userId === variables.userId,
    }),
    __param(0, (0, graphql_1.Args)('userId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsResolver.prototype, "notificationReceived", null);
exports.NotificationsResolver = NotificationsResolver = __decorate([
    (0, graphql_1.Resolver)(() => notification_model_1.Notification),
    __param(1, (0, common_1.Inject)(pubsub_module_1.PUB_SUB)),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        graphql_subscriptions_1.PubSub])
], NotificationsResolver);
//# sourceMappingURL=notifications.resolver.js.map