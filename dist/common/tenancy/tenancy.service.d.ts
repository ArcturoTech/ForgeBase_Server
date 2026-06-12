import { PrismaService } from "../../prisma/prisma.service";
export declare class TenancyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    isSuperAdmin(userId: string): Promise<boolean>;
    assertSuperAdmin(userId: string): Promise<void>;
    assertOrgMembership(userId: string, orgId: string): Promise<void>;
    resolveOrgIdByProject(projectId: string): Promise<string>;
    resolveOrgIdByBoard(boardId: string): Promise<string>;
    assertProjectAccess(userId: string, projectId: string): Promise<void>;
    assertOrgAdmin(userId: string, orgId: string): Promise<void>;
    assertProjectManager(userId: string, projectId: string): Promise<void>;
    assertBoardAccess(userId: string, boardId: string): Promise<void>;
}
