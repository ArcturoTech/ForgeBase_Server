import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { ActivityService } from '@/modules/activity/activity.service';
import { PaginationInput } from '@/common/pagination/pagination.input';
import { PaginatedInterface } from '@/common/pagination/paginated.type';
import { OrgPlan } from '@/common/graphql/enums';
import { Organization } from './models/organization.model';
import { AdminOrgRow } from './models/admin-org-row.model';
import { PlatformStats } from './models/platform-stats.model';
import { OrganizationUsage } from './models/organization-usage.model';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';

const PLAN_USAGE_LIMITS: Record<OrgPlan, { members: number; storageMb: number; webhooks: number }> = {
  STARTER: { members: 5, storageMb: 10240, webhooks: 10 },
  TEAM: { members: 25, storageMb: 51200, webhooks: 50 },
  SCALE: { members: 100, storageMb: 256000, webhooks: 200 },
};

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
    private readonly activity: ActivityService,
  ) {}

  async listOrganizations(
    pagination: PaginationInput,
  ): Promise<PaginatedInterface<Organization>> {
    const { page, limit, search } = pagination;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { slug: { contains: search, mode: 'insensitive' as const } },
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
      data: data as Organization[],
      total,
      page,
      limit,
      hasNextPage: page * limit < total,
    };
  }

  async listOrganizationsForAdmin(
    userId: string,
    pagination: PaginationInput,
  ): Promise<PaginatedInterface<AdminOrgRow>> {
    await this.tenancy.assertSuperAdmin(userId);
    const { page, limit, search } = pagination;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { slug: { contains: search, mode: 'insensitive' as const } },
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
    const enabledFlagsByOrg = new Map(
      enabledFlagGroups.map((group) => [group.orgId, group._count._all]),
    );

    const data: AdminOrgRow[] = organizations.map((organization) => ({
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

  async listOrganizationsForUser(userId: string) {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
      include: { organization: true },
      orderBy: { createdAt: 'asc' },
    });
    return memberships.map((membership) => membership.organization);
  }

  async findActiveOrganization(userId: string, activeOrgId: string | null) {
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

  async findOrganizationBySlug(userId: string, slug: string) {
    const organization = await this.prisma.organization.findUnique({ where: { slug } });
    if (!organization) throw new NotFoundException('Organização não encontrada');
    await this.tenancy.assertOrgMembership(userId, organization.id);
    return organization;
  }

  async findOrganizationById(id: string) {
    const organization = await this.prisma.organization.findUnique({ where: { id } });
    if (!organization) throw new NotFoundException('Organização não encontrada');
    return organization;
  }

  async listFeatureFlags(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.featureFlag.findMany({
      where: { orgId },
      orderBy: { key: 'asc' },
    });
  }

  async createOrganization(userId: string, input: CreateOrganizationInput) {
    const existing = await this.prisma.organization.findUnique({ where: { slug: input.slug } });
    if (existing) throw new ConflictException('Slug já está em uso');

    const organization = await this.prisma.organization.create({
      data: {
        name: input.name,
        slug: input.slug,
        plan: input.plan,
        region: input.region,
      },
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

  async findPlatformStats(userId: string): Promise<PlatformStats> {
    await this.tenancy.assertSuperAdmin(userId);
    const [
      totalOrganizations,
      activeOrganizations,
      trialOrganizations,
      suspendedOrganizations,
      totalUsers,
      mrrAggregate,
    ] = await Promise.all([
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

  async findOrganizationUsage(userId: string, orgId: string): Promise<OrganizationUsage> {
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

  async updateOrganization(userId: string, input: UpdateOrganizationInput) {
    await this.findOrganizationById(input.id);
    await this.tenancy.assertOrgMembership(userId, input.id);
    const { id, ...data } = input;
    return this.prisma.organization.update({ where: { id }, data });
  }

  async toggleFeatureFlag(userId: string, orgId: string, key: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    const flag = await this.prisma.featureFlag.findUnique({
      where: { orgId_key: { orgId, key } },
    });
    if (!flag) throw new NotFoundException('Feature flag não encontrada');
    if (flag.locked) throw new ConflictException('Feature flag está bloqueada');

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
}
