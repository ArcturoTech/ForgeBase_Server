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
exports.NotificationsService = exports.NOTIFICATION_EVENTS = void 0;
const common_1 = require("@nestjs/common");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const prisma_service_1 = require("../../prisma/prisma.service");
const pubsub_module_1 = require("../../common/pubsub/pubsub.module");
const tenancy_service_1 = require("../../common/tenancy/tenancy.service");
exports.NOTIFICATION_EVENTS = {
    received: 'notificationReceived',
};
let NotificationsService = class NotificationsService {
    prisma;
    tenancy;
    pubSub;
    constructor(prisma, tenancy, pubSub) {
        this.prisma = prisma;
        this.tenancy = tenancy;
        this.pubSub = pubSub;
    }
    async listNotifications(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        return this.prisma.notification.findMany({
            where: { orgId, userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async markNotificationRead(userId, id) {
        const notification = await this.prisma.notification.findUnique({ where: { id } });
        if (!notification)
            throw new common_1.NotFoundException('Notificação não encontrada');
        await this.tenancy.assertOrgMembership(userId, notification.orgId);
        if (notification.userId !== userId) {
            throw new common_1.ForbiddenException('Acesso negado a esta notificação');
        }
        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }
    async removeNotification(userId, id) {
        const notification = await this.prisma.notification.findUnique({ where: { id } });
        if (!notification)
            throw new common_1.NotFoundException('Notificação não encontrada');
        await this.tenancy.assertOrgMembership(userId, notification.orgId);
        if (notification.userId !== userId) {
            throw new common_1.ForbiddenException('Acesso negado a esta notificação');
        }
        await this.prisma.notification.delete({ where: { id } });
        return true;
    }
    async markAllNotificationsRead(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        const result = await this.prisma.notification.updateMany({
            where: { orgId, userId, read: false },
            data: { read: true },
        });
        return result.count;
    }
    async createNotification(userId, input) {
        await this.tenancy.assertOrgMembership(userId, input.orgId);
        return this.createNotificationInternal(input);
    }
    async createNotificationInternal(input) {
        const notification = await this.prisma.notification.create({
            data: {
                orgId: input.orgId,
                userId: input.userId,
                type: input.type,
                title: input.title,
                body: input.body,
            },
        });
        await this.pubSub.publish(exports.NOTIFICATION_EVENTS.received, {
            [exports.NOTIFICATION_EVENTS.received]: notification,
            userId: notification.userId,
        });
        return notification;
    }
    async findNotificationPreferencesByUserId(userId) {
        return this.prisma.notificationPreference.upsert({
            where: { userId },
            create: { userId },
            update: {},
        });
    }
    async updateNotificationPreferencesByUserId(userId, input) {
        return this.prisma.notificationPreference.upsert({
            where: { userId },
            create: { userId, ...input },
            update: input,
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(pubsub_module_1.PUB_SUB)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenancy_service_1.TenancyService,
        graphql_subscriptions_1.PubSub])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map