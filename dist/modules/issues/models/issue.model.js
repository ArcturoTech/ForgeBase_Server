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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Issue = void 0;
const graphql_1 = require("@nestjs/graphql");
const enums_1 = require("../../../common/graphql/enums");
const user_model_1 = require("../../../users/models/user.model");
const label_model_1 = require("./label.model");
const subtask_model_1 = require("./subtask.model");
const issue_comment_model_1 = require("./issue-comment.model");
let Issue = class Issue {
    id;
    orgId;
    boardId;
    columnId;
    sprintId;
    key;
    title;
    description;
    points;
    priority;
    position;
    urgent;
    done;
    epic;
    reporterId;
    createdAt;
    updatedAt;
    assignees;
    labels;
    subtasks;
    comments;
};
exports.Issue = Issue;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Issue.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Issue.prototype, "orgId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Issue.prototype, "boardId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Issue.prototype, "columnId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Issue.prototype, "sprintId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Issue.prototype, "key", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Issue.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Issue.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Issue.prototype, "points", void 0);
__decorate([
    (0, graphql_1.Field)(() => enums_1.Priority),
    __metadata("design:type", String)
], Issue.prototype, "priority", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Issue.prototype, "position", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Issue.prototype, "urgent", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Issue.prototype, "done", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Issue.prototype, "epic", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Issue.prototype, "reporterId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Issue.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Issue.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [user_model_1.User]),
    __metadata("design:type", Array)
], Issue.prototype, "assignees", void 0);
__decorate([
    (0, graphql_1.Field)(() => [label_model_1.Label]),
    __metadata("design:type", Array)
], Issue.prototype, "labels", void 0);
__decorate([
    (0, graphql_1.Field)(() => [subtask_model_1.Subtask]),
    __metadata("design:type", Array)
], Issue.prototype, "subtasks", void 0);
__decorate([
    (0, graphql_1.Field)(() => [issue_comment_model_1.IssueComment]),
    __metadata("design:type", Array)
], Issue.prototype, "comments", void 0);
exports.Issue = Issue = __decorate([
    (0, graphql_1.ObjectType)()
], Issue);
//# sourceMappingURL=issue.model.js.map