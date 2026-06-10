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
exports.TenancyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TenancyService = class TenancyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async isSuperAdmin(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        return user?.role === 'SUPERADMIN';
    }
    async assertSuperAdmin(userId) {
        if (!(await this.isSuperAdmin(userId))) {
            throw new common_1.ForbiddenException('Acesso restrito a super-administradores');
        }
    }
    async assertOrgMembership(userId, orgId) {
        const membership = await this.prisma.membership.findUnique({
            where: { orgId_userId: { orgId, userId } },
            select: { id: true },
        });
        if (membership) {
            return;
        }
        if (await this.isSuperAdmin(userId)) {
            return;
        }
        throw new common_1.ForbiddenException('Acesso negado a esta organização');
    }
    async resolveOrgIdByProject(projectId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: { orgId: true },
        });
        if (!project) {
            throw new common_1.ForbiddenException('Projeto não encontrado');
        }
        return project.orgId;
    }
    async resolveOrgIdByBoard(boardId) {
        const board = await this.prisma.board.findUnique({
            where: { id: boardId },
            select: { project: { select: { orgId: true } } },
        });
        if (!board) {
            throw new common_1.ForbiddenException('Board não encontrado');
        }
        return board.project.orgId;
    }
    async assertProjectAccess(userId, projectId) {
        const orgId = await this.resolveOrgIdByProject(projectId);
        await this.assertOrgMembership(userId, orgId);
    }
    async assertProjectManager(userId, projectId) {
        const orgId = await this.resolveOrgIdByProject(projectId);
        const membership = await this.prisma.membership.findUnique({
            where: { orgId_userId: { orgId, userId } },
            select: { role: true },
        });
        if (!membership) {
            if (await this.isSuperAdmin(userId)) {
                return;
            }
            throw new common_1.ForbiddenException('Acesso negado a esta organização');
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
        throw new common_1.ForbiddenException('Apenas gestores do projeto podem executar esta ação');
    }
    async assertBoardAccess(userId, boardId) {
        const orgId = await this.resolveOrgIdByBoard(boardId);
        await this.assertOrgMembership(userId, orgId);
    }
};
exports.TenancyService = TenancyService;
exports.TenancyService = TenancyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenancyService);
//# sourceMappingURL=tenancy.service.js.map