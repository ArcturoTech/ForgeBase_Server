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
exports.CreateIssueInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../common/graphql/enums");
let CreateIssueInput = class CreateIssueInput {
    orgId;
    boardId;
    columnId;
    sprintId;
    title;
    description;
    points;
    type;
    priority;
    parentId;
    startDate;
    dueDate;
    goal;
    assigneeIds;
    labelIds;
};
exports.CreateIssueInput = CreateIssueInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIssueInput.prototype, "orgId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIssueInput.prototype, "boardId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIssueInput.prototype, "columnId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIssueInput.prototype, "sprintId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIssueInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIssueInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateIssueInput.prototype, "points", void 0);
__decorate([
    (0, graphql_1.Field)(() => enums_1.IssueType, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.IssueType),
    __metadata("design:type", String)
], CreateIssueInput.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(() => enums_1.Priority, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.Priority),
    __metadata("design:type", String)
], CreateIssueInput.prototype, "priority", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIssueInput.prototype, "parentId", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateIssueInput.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateIssueInput.prototype, "dueDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIssueInput.prototype, "goal", void 0);
__decorate([
    (0, graphql_1.Field)(() => [graphql_1.ID], { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateIssueInput.prototype, "assigneeIds", void 0);
__decorate([
    (0, graphql_1.Field)(() => [graphql_1.ID], { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateIssueInput.prototype, "labelIds", void 0);
exports.CreateIssueInput = CreateIssueInput = __decorate([
    (0, graphql_1.InputType)()
], CreateIssueInput);
//# sourceMappingURL=create-issue.input.js.map