import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TenancyService {
  constructor(private readonly prisma: PrismaService) {}

  async assertOrgMembership(userId: string, orgId: string): Promise<void> {
    const membership = await this.prisma.membership.findUnique({
      where: { orgId_userId: { orgId, userId } },
      select: { id: true },
    });
    if (!membership) {
      throw new ForbiddenException('Acesso negado a esta organização');
    }
  }

  async resolveOrgIdByProject(projectId: string): Promise<string> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { orgId: true },
    });
    if (!project) {
      throw new ForbiddenException('Projeto não encontrado');
    }
    return project.orgId;
  }

  async resolveOrgIdByBoard(boardId: string): Promise<string> {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      select: { project: { select: { orgId: true } } },
    });
    if (!board) {
      throw new ForbiddenException('Board não encontrado');
    }
    return board.project.orgId;
  }

  async assertProjectAccess(userId: string, projectId: string): Promise<void> {
    const orgId = await this.resolveOrgIdByProject(projectId);
    await this.assertOrgMembership(userId, orgId);
  }

  async assertProjectManager(userId: string, projectId: string): Promise<void> {
    const orgId = await this.resolveOrgIdByProject(projectId);
    const membership = await this.prisma.membership.findUnique({
      where: { orgId_userId: { orgId, userId } },
      select: { role: true },
    });
    if (!membership) {
      throw new ForbiddenException('Acesso negado a esta organização');
    }
    if (membership.role === 'OWNER' || membership.role === 'ADMIN') {
      return;
    }
    const projectMember = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
      select: { role: true },
    });
    if (projectMember?.role === 'LEAD') {
      return;
    }
    throw new ForbiddenException('Apenas gestores do projeto podem executar esta ação');
  }

  async assertBoardAccess(userId: string, boardId: string): Promise<void> {
    const orgId = await this.resolveOrgIdByBoard(boardId);
    await this.assertOrgMembership(userId, orgId);
  }
}
