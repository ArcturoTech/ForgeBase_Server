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
exports.SnapshotsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const snapshots_service_1 = require("./snapshots.service");
const sprint_snapshot_model_1 = require("./models/sprint-snapshot.model");
const velocity_point_model_1 = require("./models/velocity-point.model");
const sprint_tag_slice_model_1 = require("./models/sprint-tag-slice.model");
const sprint_member_load_model_1 = require("./models/sprint-member-load.model");
const gql_auth_guard_1 = require("../../common/guards/gql-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let SnapshotsResolver = class SnapshotsResolver {
    snapshotsService;
    constructor(snapshotsService) {
        this.snapshotsService = snapshotsService;
    }
    listSprintBurndown(user, sprintId) {
        return this.snapshotsService.listSnapshotsBySprint(user.id, sprintId);
    }
    listSprintVelocity(user, projectId) {
        return this.snapshotsService.listVelocityByProject(user.id, projectId);
    }
    listSprintTagComposition(user, sprintId) {
        return this.snapshotsService.listSprintTagComposition(user.id, sprintId);
    }
    listSprintMemberLoad(user, sprintId) {
        return this.snapshotsService.listSprintMemberLoad(user.id, sprintId);
    }
};
exports.SnapshotsResolver = SnapshotsResolver;
__decorate([
    (0, graphql_1.Query)(() => [sprint_snapshot_model_1.SprintSnapshot]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('sprintId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SnapshotsResolver.prototype, "listSprintBurndown", null);
__decorate([
    (0, graphql_1.Query)(() => [velocity_point_model_1.VelocityPoint]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('projectId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SnapshotsResolver.prototype, "listSprintVelocity", null);
__decorate([
    (0, graphql_1.Query)(() => [sprint_tag_slice_model_1.SprintTagSlice]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('sprintId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SnapshotsResolver.prototype, "listSprintTagComposition", null);
__decorate([
    (0, graphql_1.Query)(() => [sprint_member_load_model_1.SprintMemberLoad]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('sprintId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SnapshotsResolver.prototype, "listSprintMemberLoad", null);
exports.SnapshotsResolver = SnapshotsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [snapshots_service_1.SnapshotsService])
], SnapshotsResolver);
//# sourceMappingURL=snapshots.resolver.js.map