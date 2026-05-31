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
exports.CreateInvoiceInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../common/graphql/enums");
let CreateInvoiceInput = class CreateInvoiceInput {
    orgId;
    projectId;
    number;
    clientName;
    amountCents;
    issueDate;
    dueDate;
    status;
};
exports.CreateInvoiceInput = CreateInvoiceInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceInput.prototype, "orgId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceInput.prototype, "projectId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceInput.prototype, "number", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceInput.prototype, "clientName", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInvoiceInput.prototype, "amountCents", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateInvoiceInput.prototype, "issueDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateInvoiceInput.prototype, "dueDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => enums_1.InvoiceStatus, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.InvoiceStatus),
    __metadata("design:type", String)
], CreateInvoiceInput.prototype, "status", void 0);
exports.CreateInvoiceInput = CreateInvoiceInput = __decorate([
    (0, graphql_1.InputType)()
], CreateInvoiceInput);
//# sourceMappingURL=create-invoice.input.js.map