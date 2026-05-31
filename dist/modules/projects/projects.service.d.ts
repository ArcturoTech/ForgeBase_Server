import { PrismaService } from "../../prisma/prisma.service";
import { TenancyService } from "../../common/tenancy/tenancy.service";
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
export declare class ProjectsService {
    private readonly prisma;
    private readonly tenancy;
    constructor(prisma: PrismaService, tenancy: TenancyService);
    listProjects(userId: string, orgId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orgId: string;
        status: import("generated/prisma").$Enums.ProjectStatus;
        slug: string;
        client: string | null;
        progress: number;
        color: string;
        budgetCents: number;
        spentPct: number;
        dueLabel: string | null;
    }[]>;
    countSprintsByProject(projectId: string): import("generated/prisma").Prisma.PrismaPromise<number>;
    findProjectById(userId: string, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orgId: string;
        status: import("generated/prisma").$Enums.ProjectStatus;
        slug: string;
        client: string | null;
        progress: number;
        color: string;
        budgetCents: number;
        spentPct: number;
        dueLabel: string | null;
    }>;
    listMilestonesByProject(userId: string, projectId: string): Promise<{
        name: string;
        id: string;
        done: boolean;
        progress: number;
        color: string;
        projectId: string;
        startMonth: number;
        endMonth: number;
        current: boolean;
    }[]>;
    listMembersByProject(projectId: string): import("generated/prisma").Prisma.PrismaPromise<({
        user: {
            name: string | null;
            id: string;
            email: string;
            role: import("generated/prisma").$Enums.Role;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        role: string;
        userId: string;
        hours: number;
        projectId: string;
    })[]>;
    findUserByProjectMember(userId: string): Promise<{
        name: string | null;
        id: string;
        email: string;
        role: import("generated/prisma").$Enums.Role;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createProject(userId: string, input: CreateProjectInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orgId: string;
        status: import("generated/prisma").$Enums.ProjectStatus;
        slug: string;
        client: string | null;
        progress: number;
        color: string;
        budgetCents: number;
        spentPct: number;
        dueLabel: string | null;
    }>;
    updateProject(userId: string, input: UpdateProjectInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orgId: string;
        status: import("generated/prisma").$Enums.ProjectStatus;
        slug: string;
        client: string | null;
        progress: number;
        color: string;
        budgetCents: number;
        spentPct: number;
        dueLabel: string | null;
    }>;
    removeProject(userId: string, id: string): Promise<boolean>;
    private loadProjectOrThrow;
}
