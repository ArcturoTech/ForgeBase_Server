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
exports.ActivityService = exports.ACTIVITY_EVENTS = void 0;
const common_1 = require("@nestjs/common");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const prisma_service_1 = require("../../prisma/prisma.service");
const tenancy_service_1 = require("../../common/tenancy/tenancy.service");
const pubsub_module_1 = require("../../common/pubsub/pubsub.module");
exports.ACTIVITY_EVENTS = { recorded: 'activityRecorded' };
const ACTOR_FIELDS = {
    id: true,
    name: true,
    email: true,
    role: true,
    emailVerified: true,
    createdAt: true,
    updatedAt: true,
};
let ActivityService = class ActivityService {
    prisma;
    tenancy;
    pubSub;
    constructor(prisma, tenancy, pubSub) {
        this.prisma = prisma;
        this.tenancy = tenancy;
        this.pubSub = pubSub;
    }
    async recordActivity(input) {
        const activity = await this.prisma.activity.create({
            data: {
                orgId: input.orgId,
                userId: input.userId,
                action: input.action,
                targetType: input.targetType,
                targetId: input.targetId,
            },
        });
        await this.pubSub.publish(exports.ACTIVITY_EVENTS.recorded, {
            [exports.ACTIVITY_EVENTS.recorded]: activity,
            orgId: activity.orgId,
        });
        return activity;
    }
    async listActivityByOrg(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        return this.prisma.activity.findMany({
            where: { orgId },
            orderBy: { createdAt: 'desc' },
            take: 12,
        });
    }
    async listActivityByIssueKey(userId, orgId, issueKey) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        return this.prisma.activity.findMany({
            where: { orgId, targetType: 'issue', targetId: issueKey },
            orderBy: { createdAt: 'desc' },
            take: 12,
        });
    }
    findActivityActor(userId) {
        return this.prisma.user.findUnique({ where: { id: userId }, select: ACTOR_FIELDS });
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(pubsub_module_1.PUB_SUB)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenancy_service_1.TenancyService,
        graphql_subscriptions_1.PubSub])
], ActivityService);
//# sourceMappingURL=activity.service.js.map