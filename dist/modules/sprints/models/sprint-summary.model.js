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
exports.SprintSummary = void 0;
const graphql_1 = require("@nestjs/graphql");
let SprintSummary = class SprintSummary {
    id;
    number;
    name;
    pointsDone;
    pointsTotal;
    issueCount;
    inReview;
    daysRemaining;
    durationDays;
    members;
    startDate;
    endDate;
};
exports.SprintSummary = SprintSummary;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], SprintSummary.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], SprintSummary.prototype, "number", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], SprintSummary.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], SprintSummary.prototype, "pointsDone", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], SprintSummary.prototype, "pointsTotal", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], SprintSummary.prototype, "issueCount", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], SprintSummary.prototype, "inReview", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], SprintSummary.prototype, "daysRemaining", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], SprintSummary.prototype, "durationDays", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], SprintSummary.prototype, "members", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], SprintSummary.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], SprintSummary.prototype, "endDate", void 0);
exports.SprintSummary = SprintSummary = __decorate([
    (0, graphql_1.ObjectType)()
], SprintSummary);
//# sourceMappingURL=sprint-summary.model.js.map