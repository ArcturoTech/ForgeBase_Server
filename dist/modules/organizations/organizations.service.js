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
const activity_service_1 = require("../activity/activity.service");
const PLAN_USAGE_LIMITS = {
    STARTER: { members: 5, storageMb: 10240, webhooks: 10 },
    TEAM: { members: 25, storageMb: 51200, webhooks: 50 },
    SCALE: { members: 100, storageMb: 256000, webhooks: 200 },
};
let OrganizationsService = class OrganizationsService {
    prisma;
    tenancy;
    activity;
    constructor(prisma, tenancy, activity) {
        this.prisma = prisma;
        this.tenancy = tenancy;
        this.activity = activity;
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
    async listOrganizationsForAdmin(userId, pagination) {
        await this.tenancy.assertSuperAdmin(userId);
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
        const [organizations, total] = await this.prisma.$transaction([
            this.prisma.organization.findMany({
                where,
                skip,
                take: limit,
                orderBy: { mrrCents: 'desc' },
            }),
            this.prisma.organization.count({ where }),
        ]);
        const orgIds = organizations.map((organization) => organization.id);
        const [memberGroups, enabledFlagGroups] = await Promise.all([
            this.prisma.membership.groupBy({
                by: ['orgId'],
                where: { orgId: { in: orgIds } },
                _count: { _all: true },
            }),
            this.prisma.featureFlag.groupBy({
                by: ['orgId'],
                where: { orgId: { in: orgIds }, enabled: true },
                _count: { _all: true },
            }),
        ]);
        const memberCountByOrg = new Map(memberGroups.map((group) => [group.orgId, group._count._all]));
        const enabledFlagsByOrg = new Map(enabledFlagGroups.map((group) => [group.orgId, group._count._all]));
        const data = organizations.map((organization) => ({
            id: organization.id,
            name: organization.name,
            slug: organization.slug,
            plan: organization.plan,
            status: organization.status,
            region: organization.region,
            databaseName: organization.databaseName ?? undefined,
            mrrCents: organization.mrrCents,
            trialEndsAt: organization.trialEndsAt ?? undefined,
            createdAt: organization.createdAt,
            memberCount: memberCountByOrg.get(organization.id) ?? 0,
            enabledFeatureCount: enabledFlagsByOrg.get(organization.id) ?? 0,
        }));
        return { data, total, page, limit, hasNextPage: page * limit < total };
    }
    async listOrganizationsForUser(userId) {
        const memberships = await this.prisma.membership.findMany({
            where: { userId },
            include: { organization: true },
            orderBy: { createdAt: 'asc' },
        });
        return memberships.map((membership) => membership.organization);
    }
    async findActiveOrganization(userId, activeOrgId) {
        if (activeOrgId) {
            const membership = await this.prisma.membership.findUnique({
                where: { orgId_userId: { orgId: activeOrgId, userId } },
                select: { id: true },
            });
            if (membership) {
                return this.findOrganizationById(activeOrgId);
            }
        }
        const organizations = await this.listOrganizationsForUser(userId);
        return organizations[0] ?? null;
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
    async createOrganization(userId, input) {
        const existing = await this.prisma.organization.findUnique({ where: { slug: input.slug } });
        if (existing)
            throw new common_1.ConflictException('Slug já está em uso');
        const organization = await this.prisma.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: {
                    name: input.name,
                    slug: input.slug,
                    plan: input.plan,
                    region: input.region,
                },
            });
            await tx.membership.create({
                data: { orgId: org.id, userId, role: 'OWNER' },
            });
            return org;
        });
        await this.activity.recordActivity({
            orgId: organization.id,
            userId,
            action: `provisionou a organização ${organization.name}`,
            targetType: 'organization',
            targetId: organization.id,
        });
        return organization;
    }
    async findPlatformStats(userId) {
        await this.tenancy.assertSuperAdmin(userId);
        const [totalOrganizations, activeOrganizations, trialOrganizations, suspendedOrganizations, totalUsers, mrrAggregate,] = await Promise.all([
            this.prisma.organization.count(),
            this.prisma.organization.count({ where: { status: 'ACTIVE' } }),
            this.prisma.organization.count({ where: { status: 'TRIAL' } }),
            this.prisma.organization.count({ where: { status: 'SUSPENDED' } }),
            this.prisma.user.count(),
            this.prisma.organization.aggregate({ _sum: { mrrCents: true } }),
        ]);
        return {
            totalOrganizations,
            activeOrganizations,
            trialOrganizations,
            suspendedOrganizations,
            totalUsers,
            totalMrrCents: mrrAggregate._sum.mrrCents ?? 0,
        };
    }
    async findOrganizationUsage(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        const organization = await this.findOrganizationById(orgId);
        const limits = PLAN_USAGE_LIMITS[organization.plan];
        const [memberCount, webhookCount, apiKeyCount, storageAggregate] = await Promise.all([
            this.prisma.membership.count({ where: { orgId } }),
            this.prisma.webhook.count({ where: { orgId } }),
            this.prisma.apiKey.count({ where: { orgId } }),
            this.prisma.attachment.aggregate({ where: { orgId }, _sum: { size: true } }),
        ]);
        const storageMbUsed = Math.round((storageAggregate._sum.size ?? 0) / (1024 * 1024));
        return {
            memberCount,
            memberLimit: limits.members,
            storageMbUsed,
            storageMbLimit: limits.storageMb,
            webhookCount,
            webhookLimit: limits.webhooks,
            apiKeyCount,
        };
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
        const updated = await this.prisma.featureFlag.update({
            where: { orgId_key: { orgId, key } },
            data: { enabled, enabledAt: enabled ? new Date() : null },
        });
        await this.activity.recordActivity({
            orgId,
            userId,
            action: `${enabled ? 'habilitou' : 'desabilitou'} ${flag.label}`,
            targetType: 'feature_flag',
            targetId: key,
        });
        return updated;
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenancy_service_1.TenancyService,
        activity_service_1.ActivityService])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map