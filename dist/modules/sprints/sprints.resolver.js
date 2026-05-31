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
exports.SprintsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const sprints_service_1 = require("./sprints.service");
const issues_service_1 = require("../issues/issues.service");
const sprint_model_1 = require("./models/sprint.model");
const sprint_summary_model_1 = require("./models/sprint-summary.model");
const issue_model_1 = require("../issues/models/issue.model");
const create_sprint_input_1 = require("./dto/create-sprint.input");
const update_sprint_input_1 = require("./dto/update-sprint.input");
const gql_auth_guard_1 = require("../../common/guards/gql-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let SprintsResolver = class SprintsResolver {
    sprintsService;
    issuesService;
    constructor(sprintsService, issuesService) {
        this.sprintsService = sprintsService;
        this.issuesService = issuesService;
    }
    listSprintsByProject(user, projectId) {
        return this.sprintsService.listSprintsByProject(user.id, projectId);
    }
    findActiveSprintSummary(user, orgId) {
        return this.sprintsService.findActiveSprintSummary(user.id, orgId);
    }
    findSprintById(user, id) {
        return this.sprintsService.findSprintById(user.id, id);
    }
    createSprint(user, input) {
        return this.sprintsService.createSprint(user.id, input);
    }
    updateSprint(user, input) {
        return this.sprintsService.updateSprint(user.id, input);
    }
    removeSprint(user, id) {
        return this.sprintsService.removeSprint(user.id, id);
    }
    startSprint(user, id) {
        return this.sprintsService.startSprintById(user.id, id);
    }
    closeSprint(user, id) {
        return this.sprintsService.closeSprintById(user.id, id);
    }
    issues(sprint) {
        return this.issuesService.listIssuesBySprint(sprint.id);
    }
};
exports.SprintsResolver = SprintsResolver;
__decorate([
    (0, graphql_1.Query)(() => [sprint_model_1.Sprint]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('projectId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SprintsResolver.prototype, "listSprintsByProject", null);
__decorate([
    (0, graphql_1.Query)(() => sprint_summary_model_1.SprintSummary, { nullable: true }),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SprintsResolver.prototype, "findActiveSprintSummary", null);
__decorate([
    (0, graphql_1.Query)(() => sprint_model_1.Sprint),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SprintsResolver.prototype, "findSprintById", null);
__decorate([
    (0, graphql_1.Mutation)(() => sprint_model_1.Sprint),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_sprint_input_1.CreateSprintInput]),
    __metadata("design:returntype", Promise)
], SprintsResolver.prototype, "createSprint", null);
__decorate([
    (0, graphql_1.Mutation)(() => sprint_model_1.Sprint),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_sprint_input_1.UpdateSprintInput]),
    __metadata("design:returntype", Promise)
], SprintsResolver.prototype, "updateSprint", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SprintsResolver.prototype, "removeSprint", null);
__decorate([
    (0, graphql_1.Mutation)(() => sprint_model_1.Sprint),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SprintsResolver.prototype, "startSprint", null);
__decorate([
    (0, graphql_1.Mutation)(() => sprint_model_1.Sprint),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SprintsResolver.prototype, "closeSprint", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [issue_model_1.Issue]),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sprint_model_1.Sprint]),
    __metadata("design:returntype", Promise)
], SprintsResolver.prototype, "issues", null);
exports.SprintsResolver = SprintsResolver = __decorate([
    (0, graphql_1.Resolver)(() => sprint_model_1.Sprint),
    __metadata("design:paramtypes", [sprints_service_1.SprintsService,
        issues_service_1.IssuesService])
], SprintsResolver);
//# sourceMappingURL=sprints.resolver.js.map