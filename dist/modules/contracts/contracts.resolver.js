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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const contracts_service_1 = require("./contracts.service");
const contract_model_1 = require("./models/contract.model");
const project_model_1 = require("../projects/models/project.model");
const paginated_contracts_model_1 = require("./models/paginated-contracts.model");
const create_contract_input_1 = require("./dto/create-contract.input");
const update_contract_input_1 = require("./dto/update-contract.input");
const pagination_input_1 = require("../../common/pagination/pagination.input");
const gql_auth_guard_1 = require("../../common/guards/gql-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ContractsResolver = class ContractsResolver {
    contractsService;
    constructor(contractsService) {
        this.contractsService = contractsService;
    }
    listContracts(user, orgId, pagination) {
        return this.contractsService.listContracts(user.id, orgId, pagination);
    }
    findContractById(user, id) {
        return this.contractsService.findContractById(user.id, id);
    }
    listExpiringContracts(user, orgId) {
        return this.contractsService.listExpiringContracts(user.id, orgId);
    }
    createContract(user, input) {
        return this.contractsService.createContract(user.id, input);
    }
    updateContract(user, input) {
        return this.contractsService.updateContract(user.id, input);
    }
    renewContract(user, id, expiresAt) {
        return this.contractsService.renewContract(user.id, id, expiresAt);
    }
    removeContract(user, id) {
        return this.contractsService.removeContract(user.id, id);
    }
    project(contract) {
        if (!contract.projectId)
            return Promise.resolve(null);
        return this.contractsService.findProjectByContract(contract.projectId);
    }
};
exports.ContractsResolver = ContractsResolver;
__decorate([
    (0, graphql_1.Query)(() => paginated_contracts_model_1.PaginatedContracts),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('pagination')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, pagination_input_1.PaginationInput]),
    __metadata("design:returntype", Promise)
], ContractsResolver.prototype, "listContracts", null);
__decorate([
    (0, graphql_1.Query)(() => contract_model_1.Contract),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ContractsResolver.prototype, "findContractById", null);
__decorate([
    (0, graphql_1.Query)(() => [contract_model_1.Contract]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ContractsResolver.prototype, "listExpiringContracts", null);
__decorate([
    (0, graphql_1.Mutation)(() => contract_model_1.Contract),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_contract_input_1.CreateContractInput]),
    __metadata("design:returntype", Promise)
], ContractsResolver.prototype, "createContract", null);
__decorate([
    (0, graphql_1.Mutation)(() => contract_model_1.Contract),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_contract_input_1.UpdateContractInput]),
    __metadata("design:returntype", Promise)
], ContractsResolver.prototype, "updateContract", null);
__decorate([
    (0, graphql_1.Mutation)(() => contract_model_1.Contract),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('expiresAt', { type: () => Date })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Date]),
    __metadata("design:returntype", Promise)
], ContractsResolver.prototype, "renewContract", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ContractsResolver.prototype, "removeContract", null);
__decorate([
    (0, graphql_1.ResolveField)(() => project_model_1.Project, { nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contract_model_1.Contract]),
    __metadata("design:returntype", Promise)
], ContractsResolver.prototype, "project", null);
exports.ContractsResolver = ContractsResolver = __decorate([
    (0, graphql_1.Resolver)(() => contract_model_1.Contract),
    __metadata("design:paramtypes", [contracts_service_1.ContractsService])
], ContractsResolver);
//# sourceMappingURL=contracts.resolver.js.map