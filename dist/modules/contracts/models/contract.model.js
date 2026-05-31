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
exports.Contract = void 0;
const graphql_1 = require("@nestjs/graphql");
const enums_1 = require("../../../common/graphql/enums");
let Contract = class Contract {
    id;
    orgId;
    projectId;
    number;
    clientName;
    name;
    valueLabel;
    status;
    expiresAt;
    createdAt;
    updatedAt;
};
exports.Contract = Contract;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Contract.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Contract.prototype, "orgId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "projectId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Contract.prototype, "number", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Contract.prototype, "clientName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Contract.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Contract.prototype, "valueLabel", void 0);
__decorate([
    (0, graphql_1.Field)(() => enums_1.ContractStatus),
    __metadata("design:type", String)
], Contract.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Contract.prototype, "expiresAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Contract.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Contract.prototype, "updatedAt", void 0);
exports.Contract = Contract = __decorate([
    (0, graphql_1.ObjectType)()
], Contract);
//# sourceMappingURL=contract.model.js.map