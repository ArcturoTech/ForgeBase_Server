import { PrismaService } from "../../prisma/prisma.service";
import { TenancyService } from "../../common/tenancy/tenancy.service";
import { PaginationInput } from "../../common/pagination/pagination.input";
import { PaginatedInterface } from "../../common/pagination/paginated.type";
import { Organization } from './models/organization.model';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
export declare class OrganizationsService {
    private readonly prisma;
    private readonly tenancy;
    constructor(prisma: PrismaService, tenancy: TenancyService);
    listOrganizations(pagination: PaginationInput): Promise<PaginatedInterface<Organization>>;
    listOrganizationsForUser(userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("generated/prisma").$Enums.OrgStatus;
        plan: import("generated/prisma").$Enums.OrgPlan;
        slug: string;
        region: string;
        databaseName: string | null;
        mrrCents: number;
        trialEndsAt: Date | null;
    }[]>;
    findOrganizationBySlug(userId: string, slug: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("generated/prisma").$Enums.OrgStatus;
        plan: import("generated/prisma").$Enums.OrgPlan;
        slug: string;
        region: string;
        databaseName: string | null;
        mrrCents: number;
        trialEndsAt: Date | null;
    }>;
    findOrganizationById(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("generated/prisma").$Enums.OrgStatus;
        plan: import("generated/prisma").$Enums.OrgPlan;
        slug: string;
        region: string;
        databaseName: string | null;
        mrrCents: number;
        trialEndsAt: Date | null;
    }>;
    listFeatureFlags(userId: string, orgId: string): Promise<{
        label: string;
        id: string;
        orgId: string;
        key: string;
        description: string;
        enabled: boolean;
        locked: boolean;
        enabledAt: Date | null;
    }[]>;
    createOrganization(input: CreateOrganizationInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("generated/prisma").$Enums.OrgStatus;
        plan: import("generated/prisma").$Enums.OrgPlan;
        slug: string;
        region: string;
        databaseName: string | null;
        mrrCents: number;
        trialEndsAt: Date | null;
    }>;
    updateOrganization(userId: string, input: UpdateOrganizationInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("generated/prisma").$Enums.OrgStatus;
        plan: import("generated/prisma").$Enums.OrgPlan;
        slug: string;
        region: string;
        databaseName: string | null;
        mrrCents: number;
        trialEndsAt: Date | null;
    }>;
    toggleFeatureFlag(userId: string, orgId: string, key: string): Promise<{
        label: string;
        id: string;
        orgId: string;
        key: string;
        description: string;
        enabled: boolean;
        locked: boolean;
        enabledAt: Date | null;
    }>;
}
