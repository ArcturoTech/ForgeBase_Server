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
exports.IssuesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const issues_service_1 = require("./issues.service");
const issue_model_1 = require("./models/issue.model");
const subtask_model_1 = require("./models/subtask.model");
const label_model_1 = require("./models/label.model");
const issue_comment_model_1 = require("./models/issue-comment.model");
const column_model_1 = require("../boards/models/column.model");
const create_issue_input_1 = require("./dto/create-issue.input");
const update_issue_input_1 = require("./dto/update-issue.input");
const move_issue_input_1 = require("./dto/move-issue.input");
const issue_content_input_1 = require("./dto/issue-content.input");
const assign_issue_to_sprint_input_1 = require("./dto/assign-issue-to-sprint.input");
const user_model_1 = require("../../users/models/user.model");
const pubsub_module_1 = require("../../common/pubsub/pubsub.module");
const gql_auth_guard_1 = require("../../common/guards/gql-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let IssuesResolver = class IssuesResolver {
    issuesService;
    pubSub;
    constructor(issuesService, pubSub) {
        this.issuesService = issuesService;
        this.pubSub = pubSub;
    }
    listIssuesByBoard(user, boardId) {
        return this.issuesService.listIssuesByBoard(user.id, boardId);
    }
    findIssueById(user, id) {
        return this.issuesService.findIssueById(user.id, id);
    }
    createIssue(user, input) {
        return this.issuesService.createIssue(user.id, input);
    }
    updateIssue(user, input) {
        return this.issuesService.updateIssue(user.id, input);
    }
    moveIssue(user, input) {
        return this.issuesService.moveIssue(user.id, input);
    }
    removeIssue(user, id) {
        return this.issuesService.removeIssue(user.id, id);
    }
    listMyAssignedIssues(user) {
        return this.issuesService.listIssuesAssignedToUser(user.id);
    }
    listBacklogIssuesByProject(user, projectId) {
        return this.issuesService.listBacklogIssuesByProject(user.id, projectId);
    }
    assignIssueToSprint(user, input) {
        return this.issuesService.assignIssueToSprint(user.id, input);
    }
    addSubtaskToIssue(user, input) {
        return this.issuesService.addSubtaskToIssue(user.id, input);
    }
    toggleSubtask(user, subtaskId) {
        return this.issuesService.toggleSubtask(user.id, subtaskId);
    }
    addCommentToIssue(user, input) {
        return this.issuesService.addCommentToIssue(user.id, input);
    }
    assignees(issue, loaders) {
        return loaders.issueAssignees.load(issue.id);
    }
    labels(issue, loaders) {
        return loaders.issueLabels.load(issue.id);
    }
    subtasks(issue, loaders) {
        return loaders.issueSubtasks.load(issue.id);
    }
    comments(issue, loaders) {
        return loaders.issueComments.load(issue.id);
    }
    column(issue) {
        return this.issuesService.findColumnByIssue(issue.columnId);
    }
    issueMoved(_boardId) {
        return this.pubSub.asyncIterator(issues_service_1.ISSUE_EVENTS.moved);
    }
    issueCreated(_boardId) {
        return this.pubSub.asyncIterator(issues_service_1.ISSUE_EVENTS.created);
    }
    issueUpdated(_boardId) {
        return this.pubSub.asyncIterator(issues_service_1.ISSUE_EVENTS.updated);
    }
    issueCommented(_boardId) {
        return this.pubSub.asyncIterator(issues_service_1.ISSUE_EVENTS.commented);
    }
};
exports.IssuesResolver = IssuesResolver;
__decorate([
    (0, graphql_1.Query)(() => [issue_model_1.Issue]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('boardId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "listIssuesByBoard", null);
__decorate([
    (0, graphql_1.Query)(() => issue_model_1.Issue),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "findIssueById", null);
__decorate([
    (0, graphql_1.Mutation)(() => issue_model_1.Issue),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_issue_input_1.CreateIssueInput]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "createIssue", null);
__decorate([
    (0, graphql_1.Mutation)(() => issue_model_1.Issue),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_issue_input_1.UpdateIssueInput]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "updateIssue", null);
__decorate([
    (0, graphql_1.Mutation)(() => issue_model_1.Issue),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, move_issue_input_1.MoveIssueInput]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "moveIssue", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "removeIssue", null);
__decorate([
    (0, graphql_1.Query)(() => [issue_model_1.Issue]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "listMyAssignedIssues", null);
__decorate([
    (0, graphql_1.Query)(() => [issue_model_1.Issue]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('projectId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "listBacklogIssuesByProject", null);
__decorate([
    (0, graphql_1.Mutation)(() => issue_model_1.Issue),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, assign_issue_to_sprint_input_1.AssignIssueToSprintInput]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "assignIssueToSprint", null);
__decorate([
    (0, graphql_1.Mutation)(() => subtask_model_1.Subtask),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, issue_content_input_1.AddSubtaskInput]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "addSubtaskToIssue", null);
__decorate([
    (0, graphql_1.Mutation)(() => subtask_model_1.Subtask),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('subtaskId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "toggleSubtask", null);
__decorate([
    (0, graphql_1.Mutation)(() => issue_comment_model_1.IssueComment),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, issue_content_input_1.AddCommentToIssueInput]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "addCommentToIssue", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [user_model_1.User]),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Context)('loaders')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [issue_model_1.Issue, Object]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "assignees", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [label_model_1.Label]),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Context)('loaders')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [issue_model_1.Issue, Object]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "labels", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [subtask_model_1.Subtask]),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Context)('loaders')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [issue_model_1.Issue, Object]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "subtasks", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [issue_comment_model_1.IssueComment]),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Context)('loaders')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [issue_model_1.Issue, Object]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "comments", null);
__decorate([
    (0, graphql_1.ResolveField)(() => column_model_1.Column),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [issue_model_1.Issue]),
    __metadata("design:returntype", Promise)
], IssuesResolver.prototype, "column", null);
__decorate([
    (0, graphql_1.Subscription)(() => issue_model_1.Issue, {
        filter: (payload, variables) => payload.boardId === variables.boardId,
    }),
    __param(0, (0, graphql_1.Args)('boardId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IssuesResolver.prototype, "issueMoved", null);
__decorate([
    (0, graphql_1.Subscription)(() => issue_model_1.Issue, {
        filter: (payload, variables) => payload.boardId === variables.boardId,
    }),
    __param(0, (0, graphql_1.Args)('boardId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IssuesResolver.prototype, "issueCreated", null);
__decorate([
    (0, graphql_1.Subscription)(() => issue_model_1.Issue, {
        filter: (payload, variables) => payload.boardId === variables.boardId,
    }),
    __param(0, (0, graphql_1.Args)('boardId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IssuesResolver.prototype, "issueUpdated", null);
__decorate([
    (0, graphql_1.Subscription)(() => issue_model_1.Issue, {
        filter: (payload, variables) => payload.boardId === variables.boardId,
    }),
    __param(0, (0, graphql_1.Args)('boardId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IssuesResolver.prototype, "issueCommented", null);
exports.IssuesResolver = IssuesResolver = __decorate([
    (0, graphql_1.Resolver)(() => issue_model_1.Issue),
    __param(1, (0, common_1.Inject)(pubsub_module_1.PUB_SUB)),
    __metadata("design:paramtypes", [issues_service_1.IssuesService,
        graphql_subscriptions_1.PubSub])
], IssuesResolver);
//# sourceMappingURL=issues.resolver.js.map