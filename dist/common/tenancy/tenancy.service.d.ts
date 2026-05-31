import { PrismaService } from "../../prisma/prisma.service";
export declare class TenancyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    assertOrgMembership(userId: string, orgId: string): Promise<void>;
    resolveOrgIdByProject(projectId: string): Promise<string>;
    resolveOrgIdByBoard(boardId: string): Promise<string>;
    assertProjectAccess(userId: string, projectId: string): Promise<void>;
    assertBoardAccess(userId: string, boardId: string): Promise<void>;
}
