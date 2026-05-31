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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const tenancy_service_1 = require("../../common/tenancy/tenancy.service");
const enums_1 = require("../../common/graphql/enums");
let ContractsService = class ContractsService {
    prisma;
    tenancy;
    constructor(prisma, tenancy) {
        this.prisma = prisma;
        this.tenancy = tenancy;
    }
    async listContracts(userId, orgId, pagination) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        const { page, limit, search } = pagination;
        const skip = (page - 1) * limit;
        const where = {
            orgId,
            ...(search
                ? {
                    OR: [
                        { clientName: { contains: search, mode: 'insensitive' } },
                        { name: { contains: search, mode: 'insensitive' } },
                        { number: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {}),
        };
        const [data, total] = await this.prisma.$transaction([
            this.prisma.contract.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.contract.count({ where }),
        ]);
        return {
            data: data,
            total,
            page,
            limit,
            hasNextPage: page * limit < total,
        };
    }
    async findContractById(userId, id) {
        const contract = await this.loadContractOrThrow(id);
        await this.tenancy.assertOrgMembership(userId, contract.orgId);
        return contract;
    }
    findProjectByContract(projectId) {
        return this.prisma.project.findUnique({ where: { id: projectId } });
    }
    async listExpiringContracts(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        const now = new Date();
        const threshold = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return this.prisma.contract.findMany({
            where: {
                orgId,
                status: enums_1.ContractStatus.ACTIVE,
                expiresAt: { gte: now, lte: threshold },
            },
            orderBy: { expiresAt: 'asc' },
        });
    }
    async createContract(userId, input) {
        await this.tenancy.assertOrgMembership(userId, input.orgId);
        return this.prisma.contract.create({
            data: {
                orgId: input.orgId,
                projectId: input.projectId,
                number: input.number,
                clientName: input.clientName,
                name: input.name,
                valueLabel: input.valueLabel,
                status: input.status,
                expiresAt: input.expiresAt,
            },
        });
    }
    async updateContract(userId, input) {
        const contract = await this.loadContractOrThrow(input.id);
        await this.tenancy.assertOrgMembership(userId, contract.orgId);
        const { id, ...data } = input;
        return this.prisma.contract.update({ where: { id }, data });
    }
    async renewContract(userId, id, expiresAt) {
        const contract = await this.loadContractOrThrow(id);
        await this.tenancy.assertOrgMembership(userId, contract.orgId);
        return this.prisma.contract.update({
            where: { id },
            data: { expiresAt, status: enums_1.ContractStatus.ACTIVE },
        });
    }
    async removeContract(userId, id) {
        const contract = await this.loadContractOrThrow(id);
        await this.tenancy.assertOrgMembership(userId, contract.orgId);
        await this.prisma.contract.delete({ where: { id } });
        return true;
    }
    async loadContractOrThrow(id) {
        const contract = await this.prisma.contract.findUnique({ where: { id } });
        if (!contract)
            throw new common_1.NotFoundException('Contrato não encontrado');
        return contract;
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenancy_service_1.TenancyService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map