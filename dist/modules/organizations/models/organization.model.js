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
exports.Organization = void 0;
const graphql_1 = require("@nestjs/graphql");
const enums_1 = require("../../../common/graphql/enums");
let Organization = class Organization {
    id;
    name;
    slug;
    plan;
    status;
    region;
    databaseName;
    mrrCents;
    trialEndsAt;
    createdAt;
    updatedAt;
};
exports.Organization = Organization;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Organization.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Organization.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Organization.prototype, "slug", void 0);
__decorate([
    (0, graphql_1.Field)(() => enums_1.OrgPlan),
    __metadata("design:type", String)
], Organization.prototype, "plan", void 0);
__decorate([
    (0, graphql_1.Field)(() => enums_1.OrgStatus),
    __metadata("design:type", String)
], Organization.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Organization.prototype, "region", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Organization.prototype, "databaseName", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Organization.prototype, "mrrCents", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Organization.prototype, "trialEndsAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Organization.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Organization.prototype, "updatedAt", void 0);
exports.Organization = Organization = __decorate([
    (0, graphql_1.ObjectType)()
], Organization);
//# sourceMappingURL=organization.model.js.map