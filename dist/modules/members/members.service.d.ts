import { PrismaService } from "../../prisma/prisma.service";
import { TenancyService } from "../../common/tenancy/tenancy.service";
import { MemberRole } from "../../common/graphql/enums";
export declare class MembersService {
    private readonly prisma;
    private readonly tenancy;
    constructor(prisma: PrismaService, tenancy: TenancyService);
    listMembers(userId: string, orgId: string): Promise<{
        id: string;
        role: import("generated/prisma").$Enums.MemberRole;
        createdAt: Date;
        userId: string;
        orgId: string;
        title: string | null;
    }[]>;
    findMembershipById(membershipId: string): Promise<{
        id: string;
        role: import("generated/prisma").$Enums.MemberRole;
        createdAt: Date;
        userId: string;
        orgId: string;
        title: string | null;
    }>;
    inviteMember(userId: string, orgId: string, memberUserId: string, role?: MemberRole, title?: string): Promise<{
        id: string;
        role: import("generated/prisma").$Enums.MemberRole;
        createdAt: Date;
        userId: string;
        orgId: string;
        title: string | null;
    }>;
    updateMemberRole(userId: string, membershipId: string, role: MemberRole): Promise<{
        id: string;
        role: import("generated/prisma").$Enums.MemberRole;
        createdAt: Date;
        userId: string;
        orgId: string;
        title: string | null;
    }>;
    removeMember(userId: string, membershipId: string): Promise<boolean>;
    findUserByMember(userId: string): Promise<{
        name: string | null;
        id: string;
        email: string;
        role: import("generated/prisma").$Enums.Role;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
