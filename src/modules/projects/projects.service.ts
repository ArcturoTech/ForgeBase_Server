import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

const USER_FIELDS = {
  id: true,
  name: true,
  email: true,
  role: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

  async listProjects(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.project.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });
  }

  countSprintsByProject(projectId: string) {
    return this.prisma.sprint.count({ where: { projectId } });
  }

  async findProjectById(userId: string, id: string) {
    const project = await this.loadProjectOrThrow(id);
    await this.tenancy.assertOrgMembership(userId, project.orgId);
    return project;
  }

  async listMilestonesByProject(userId: string, projectId: string) {
    await this.tenancy.assertProjectAccess(userId, projectId);
    return this.prisma.milestone.findMany({
      where: { projectId },
      orderBy: { startMonth: 'asc' },
    });
  }

  listMembersByProject(projectId: string) {
    return this.prisma.projectMember.findMany({
      where: { projectId },
      include: { user: { select: USER_FIELDS } },
    });
  }

  async findUserByProjectMember(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: USER_FIELDS,
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async createProject(userId: string, input: CreateProjectInput) {
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

  async updateProject(userId: string, input: UpdateProjectInput) {
    const project = await this.loadProjectOrThrow(input.id);
    await this.tenancy.assertOrgMembership(userId, project.orgId);
    const { id, ...data } = input;
    return this.prisma.project.update({ where: { id }, data });
  }

  async removeProject(userId: string, id: string) {
    const project = await this.loadProjectOrThrow(id);
    await this.tenancy.assertOrgMembership(userId, project.orgId);
    await this.prisma.project.delete({ where: { id } });
    return true;
  }

  private async loadProjectOrThrow(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Projeto não encontrado');
    return project;
  }
}
