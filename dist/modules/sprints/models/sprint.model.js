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
exports.Sprint = void 0;
const graphql_1 = require("@nestjs/graphql");
const enums_1 = require("../../../common/graphql/enums");
let Sprint = class Sprint {
    id;
    projectId;
    number;
    name;
    code;
    status;
    startDate;
    endDate;
    totalPoints;
    targetPoints;
    createdAt;
};
exports.Sprint = Sprint;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Sprint.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Sprint.prototype, "projectId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Sprint.prototype, "number", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Sprint.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Sprint.prototype, "code", void 0);
__decorate([
    (0, graphql_1.Field)(() => enums_1.SprintStatus),
    __metadata("design:type", String)
], Sprint.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Sprint.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Sprint.prototype, "endDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Sprint.prototype, "totalPoints", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Sprint.prototype, "targetPoints", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Sprint.prototype, "createdAt", void 0);
exports.Sprint = Sprint = __decorate([
    (0, graphql_1.ObjectType)()
], Sprint);
//# sourceMappingURL=sprint.model.js.map