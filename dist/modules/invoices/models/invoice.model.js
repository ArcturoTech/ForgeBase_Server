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
exports.Invoice = void 0;
const graphql_1 = require("@nestjs/graphql");
const enums_1 = require("../../../common/graphql/enums");
let Invoice = class Invoice {
    id;
    orgId;
    projectId;
    number;
    clientName;
    amountCents;
    issueDate;
    dueDate;
    status;
    paidAt;
    createdAt;
    updatedAt;
};
exports.Invoice = Invoice;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Invoice.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Invoice.prototype, "orgId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "projectId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Invoice.prototype, "number", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Invoice.prototype, "clientName", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Invoice.prototype, "amountCents", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Invoice.prototype, "issueDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Invoice.prototype, "dueDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => enums_1.InvoiceStatus),
    __metadata("design:type", String)
], Invoice.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Invoice.prototype, "paidAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Invoice.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Invoice.prototype, "updatedAt", void 0);
exports.Invoice = Invoice = __decorate([
    (0, graphql_1.ObjectType)()
], Invoice);
//# sourceMappingURL=invoice.model.js.map