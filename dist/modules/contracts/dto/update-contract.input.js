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
exports.UpdateContractInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../common/graphql/enums");
let UpdateContractInput = class UpdateContractInput {
    id;
    clientName;
    name;
    valueLabel;
    status;
    expiresAt;
};
exports.UpdateContractInput = UpdateContractInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContractInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContractInput.prototype, "clientName", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContractInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContractInput.prototype, "valueLabel", void 0);
__decorate([
    (0, graphql_1.Field)(() => enums_1.ContractStatus, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.ContractStatus),
    __metadata("design:type", String)
], UpdateContractInput.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateContractInput.prototype, "expiresAt", void 0);
exports.UpdateContractInput = UpdateContractInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateContractInput);
//# sourceMappingURL=update-contract.input.js.map