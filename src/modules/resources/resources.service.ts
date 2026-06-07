import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { CreateProjectResourceInput } from './dto/create-project-resource.input';
import { UpdateProjectResourceInput } from './dto/update-project-resource.input';

@Injectable()
export class ResourcesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

  async listProjectResources(userId: string, projectId: string) {
    await this.tenancy.assertProjectAccess(userId, projectId);
    return this.prisma.projectResource.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createProjectResource(userId: string, input: CreateProjectResourceInput) {
    await this.tenancy.assertProjectAccess(userId, input.projectId);
    return this.prisma.projectResource.create({
      data: {
        projectId: input.projectId,
        type: input.type,
        label: input.label,
        url: input.url,
      },
    });
  }

  async updateProjectResource(userId: string, input: UpdateProjectResourceInput) {
    const resource = await this.loadResourceOrThrow(input.id);
    await this.tenancy.assertProjectAccess(userId, resource.projectId);
    const { id, ...data } = input;
    return this.prisma.projectResource.update({ where: { id }, data });
  }

  async removeProjectResource(userId: string, id: string) {
    const resource = await this.loadResourceOrThrow(id);
    await this.tenancy.assertProjectAccess(userId, resource.projectId);
    await this.prisma.projectResource.delete({ where: { id } });
    return true;
  }

  private async loadResourceOrThrow(id: string) {
    const resource = await this.prisma.projectResource.findUnique({ where: { id } });
    if (!resource) throw new NotFoundException('Recurso não encontrado');
    return resource;
  }
}
