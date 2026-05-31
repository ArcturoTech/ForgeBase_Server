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
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const tenancy_service_1 = require("../../common/tenancy/tenancy.service");
let OrganizationsService = class OrganizationsService {
    prisma;
    tenancy;
    constructor(prisma, tenancy) {
        this.prisma = prisma;
        this.tenancy = tenancy;
    }
    async listOrganizations(pagination) {
        const { page, limit, search } = pagination;
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { slug: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [data, total] = await this.prisma.$transaction([
            this.prisma.organization.findMany({
                where,
                skip,
                take: limit,
                orderBy: { mrrCents: 'desc' },
            }),
            this.prisma.organization.count({ where }),
        ]);
        return {
            data: data,
            total,
            page,
            limit,
            hasNextPage: page * limit < total,
        };
    }
    async listOrganizationsForUser(userId) {
        const memberships = await this.prisma.membership.findMany({
            where: { userId },
            include: { organization: true },
            orderBy: { createdAt: 'asc' },
        });
        return memberships.map((membership) => membership.organization);
    }
    async findOrganizationBySlug(userId, slug) {
        const organization = await this.prisma.organization.findUnique({ where: { slug } });
        if (!organization)
            throw new common_1.NotFoundException('Organização não encontrada');
        await this.tenancy.assertOrgMembership(userId, organization.id);
        return organization;
    }
    async findOrganizationById(id) {
        const organization = await this.prisma.organization.findUnique({ where: { id } });
        if (!organization)
            throw new common_1.NotFoundException('Organização não encontrada');
        return organization;
    }
    async listFeatureFlags(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        return this.prisma.featureFlag.findMany({
            where: { orgId },
            orderBy: { key: 'asc' },
        });
    }
    async createOrganization(input) {
        const existing = await this.prisma.organization.findUnique({ where: { slug: input.slug } });
        if (existing)
            throw new common_1.ConflictException('Slug já está em uso');
        return this.prisma.organization.create({
            data: {
                name: input.name,
                slug: input.slug,
                plan: input.plan,
                region: input.region,
            },
        });
    }
    async updateOrganization(userId, input) {
        await this.findOrganizationById(input.id);
        await this.tenancy.assertOrgMembership(userId, input.id);
        const { id, ...data } = input;
        return this.prisma.organization.update({ where: { id }, data });
    }
    async toggleFeatureFlag(userId, orgId, key) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        const flag = await this.prisma.featureFlag.findUnique({
            where: { orgId_key: { orgId, key } },
        });
        if (!flag)
            throw new common_1.NotFoundException('Feature flag não encontrada');
        if (flag.locked)
            throw new common_1.ConflictException('Feature flag está bloqueada');
        const enabled = !flag.enabled;
        return this.prisma.featureFlag.update({
            where: { orgId_key: { orgId, key } },
            data: { enabled, enabledAt: enabled ? new Date() : null },
        });
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenancy_service_1.TenancyService])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map