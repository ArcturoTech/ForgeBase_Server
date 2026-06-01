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
exports.Project = void 0;
const graphql_1 = require("@nestjs/graphql");
const enums_1 = require("../../../common/graphql/enums");
const project_member_model_1 = require("./project-member.model");
let Project = class Project {
    id;
    orgId;
    name;
    slug;
    client;
    status;
    progress;
    color;
    budgetCents;
    spentPct;
    dueLabel;
    deadline;
    createdAt;
    updatedAt;
    members;
};
exports.Project = Project;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Project.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Project.prototype, "orgId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Project.prototype, "slug", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "client", void 0);
__decorate([
    (0, graphql_1.Field)(() => enums_1.ProjectStatus),
    __metadata("design:type", String)
], Project.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Project.prototype, "progress", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Project.prototype, "color", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Project.prototype, "budgetCents", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Project.prototype, "spentPct", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "dueLabel", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", Date)
], Project.prototype, "deadline", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [project_member_model_1.ProjectMember]),
    __metadata("design:type", Array)
], Project.prototype, "members", void 0);
exports.Project = Project = __decorate([
    (0, graphql_1.ObjectType)()
], Project);
//# sourceMappingURL=project.model.js.map