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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const tenancy_service_1 = require("../../common/tenancy/tenancy.service");
const USER_FIELDS = {
    id: true,
    name: true,
    email: true,
    role: true,
    emailVerified: true,
    createdAt: true,
    updatedAt: true,
};
let ProjectsService = class ProjectsService {
    prisma;
    tenancy;
    constructor(prisma, tenancy) {
        this.prisma = prisma;
        this.tenancy = tenancy;
    }
    async listProjects(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        return this.prisma.project.findMany({
            where: { orgId },
            orderBy: { createdAt: 'desc' },
        });
    }
    countSprintsByProject(projectId) {
        return this.prisma.sprint.count({ where: { projectId } });
    }
    async findProjectById(userId, id) {
        const project = await this.loadProjectOrThrow(id);
        await this.tenancy.assertOrgMembership(userId, project.orgId);
        return project;
    }
    async listMilestonesByProject(userId, projectId) {
        await this.tenancy.assertProjectAccess(userId, projectId);
        return this.prisma.milestone.findMany({
            where: { projectId },
            orderBy: { startMonth: 'asc' },
        });
    }
    listMembersByProject(projectId) {
        return this.prisma.projectMember.findMany({
            where: { projectId },
            include: { user: { select: USER_FIELDS } },
        });
    }
    async findUserByProjectMember(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: USER_FIELDS,
        });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        return user;
    }
    async createProject(userId, input) {
        await this.tenancy.assertOrgMembership(userId, input.orgId);
        return this.prisma.project.create({
            data: {
                orgId: input.orgId,
                name: input.name,
                slug: input.slug,
                client: input.client,
                color: input.color ?? 'oklch(0.62 0.13 240)',
                budgetCents: input.budgetCents ?? 0,
            },
        });
    }
    async updateProject(userId, input) {
        const project = await this.loadProjectOrThrow(input.id);
        await this.tenancy.assertOrgMembership(userId, project.orgId);
        const { id, ...data } = input;
        return this.prisma.project.update({ where: { id }, data });
    }
    async removeProject(userId, id) {
        const project = await this.loadProjectOrThrow(id);
        await this.tenancy.assertOrgMembership(userId, project.orgId);
        await this.prisma.project.delete({ where: { id } });
        return true;
    }
    async loadProjectOrThrow(id) {
        const project = await this.prisma.project.findUnique({ where: { id } });
        if (!project)
            throw new common_1.NotFoundException('Projeto não encontrado');
        return project;
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenancy_service_1.TenancyService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map