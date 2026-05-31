import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { PaginationInput } from '@/common/pagination/pagination.input';
import { PaginatedInterface } from '@/common/pagination/paginated.type';
import { Organization } from './models/organization.model';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
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

  async listOrganizationsForUser(userId: string) {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
      include: { organization: true },
      orderBy: { createdAt: 'asc' },
    });
    return memberships.map((membership) => membership.organization);
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

  async createOrganization(input: CreateOrganizationInput) {
    const existing = await this.prisma.organization.findUnique({ where: { slug: input.slug } });
    if (existing) throw new ConflictException('Slug já está em uso');

    return this.prisma.organization.create({
      data: {
        name: input.name,
        slug: input.slug,
        plan: input.plan,
        region: input.region,
      },
    });
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
    return this.prisma.featureFlag.update({
      where: { orgId_key: { orgId, key } },
      data: { enabled, enabledAt: enabled ? new Date() : null },
    });
  }
}
