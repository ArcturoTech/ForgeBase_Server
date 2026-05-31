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
exports.ActivityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const activity_service_1 = require("./activity.service");
const activity_model_1 = require("./models/activity.model");
const user_model_1 = require("../../users/models/user.model");
const pubsub_module_1 = require("../../common/pubsub/pubsub.module");
const gql_auth_guard_1 = require("../../common/guards/gql-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ActivityResolver = class ActivityResolver {
    activityService;
    pubSub;
    constructor(activityService, pubSub) {
        this.activityService = activityService;
        this.pubSub = pubSub;
    }
    listActivityFeed(user, orgId) {
        return this.activityService.listActivityByOrg(user.id, orgId);
    }
    actor(activity) {
        return this.activityService.findActivityActor(activity.userId);
    }
    activityRecorded(_orgId) {
        return this.pubSub.asyncIterator(activity_service_1.ACTIVITY_EVENTS.recorded);
    }
};
exports.ActivityResolver = ActivityResolver;
__decorate([
    (0, graphql_1.Query)(() => [activity_model_1.Activity]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ActivityResolver.prototype, "listActivityFeed", null);
__decorate([
    (0, graphql_1.ResolveField)(() => user_model_1.User, { nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActivityResolver.prototype, "actor", null);
__decorate([
    (0, graphql_1.Subscription)(() => activity_model_1.Activity, {
        filter: (payload, variables) => payload.orgId === variables.orgId,
    }),
    __param(0, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ActivityResolver.prototype, "activityRecorded", null);
exports.ActivityResolver = ActivityResolver = __decorate([
    (0, graphql_1.Resolver)(() => activity_model_1.Activity),
    __param(1, (0, common_1.Inject)(pubsub_module_1.PUB_SUB)),
    __metadata("design:paramtypes", [activity_service_1.ActivityService,
        graphql_subscriptions_1.PubSub])
], ActivityResolver);
//# sourceMappingURL=activity.resolver.js.map