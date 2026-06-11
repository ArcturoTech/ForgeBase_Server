import { Injectable, NotFoundException } from '@nestjs/common';
import { EnvScope, ProjectEnvVar } from '@/prisma/prisma-client';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { EncryptionService } from '@/common/crypto/encryption.service';
import { ActivityService } from '@/modules/activity/activity.service';
import { CreateProjectEnvVarInput } from './dto/create-project-env-var.input';
import { UpdateProjectEnvVarInput } from './dto/update-project-env-var.input';

const MASK = '••••••••';

const ENV_VAR_ACTIONS = {
  created: 'env_var.created',
  updated: 'env_var.updated',
  removed: 'env_var.removed',
  revealed: 'env_var.revealed',
  exported: 'env_var.exported',
} as const;

@Injectable()
export class EnvVarsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
    private readonly encryption: EncryptionService,
    private readonly activity: ActivityService,
  ) {}

  async listProjectEnvVars(userId: string, projectId: string) {
    await this.tenancy.assertProjectAccess(userId, projectId);
    const envVars = await this.prisma.projectEnvVar.findMany({
      where: { projectId },
      orderBy: [{ scope: 'asc' }, { key: 'asc' }],
    });
    return envVars.map((envVar) => this.toModel(envVar));
  }

  async revealProjectEnvVar(userId: string, id: string) {
    const envVar = await this.loadEnvVarOrThrow(id);
    await this.tenancy.assertProjectManager(userId, envVar.projectId);
    await this.recordEnvVarActivity(userId, envVar.projectId, ENV_VAR_ACTIONS.revealed, envVar.id);
    return this.encryption.decrypt(envVar.valueEnc);
  }

  async exportProjectEnvFile(userId: string, projectId: string, scope: EnvScope) {
    await this.tenancy.assertProjectManager(userId, projectId);
    const scopes = scope === EnvScope.SHARED ? [EnvScope.SHARED] : [scope, EnvScope.SHARED];
    const envVars = await this.prisma.projectEnvVar.findMany({
      where: { projectId, scope: { in: scopes } },
      orderBy: [{ scope: 'asc' }, { key: 'asc' }],
    });

    const merged = new Map<string, string>();
    for (const envVar of envVars) {
      if (envVar.scope === EnvScope.SHARED && merged.has(envVar.key)) continue;
      merged.set(envVar.key, this.encryption.decrypt(envVar.valueEnc));
    }

    await this.recordEnvVarActivity(userId, projectId, ENV_VAR_ACTIONS.exported, scope);

    return [...merged.entries()].map(([key, value]) => this.toEnvLine(key, value)).join('\n');
  }

  async exportProjectEnvFilesByCategory(
    userId: string,
    projectId: string,
    scope: EnvScope,
    categories: string[],
  ) {
    await this.tenancy.assertProjectManager(userId, projectId);
    const scopes = scope === EnvScope.SHARED ? [EnvScope.SHARED] : [scope, EnvScope.SHARED];
    const envVars = await this.prisma.projectEnvVar.findMany({
      where: { projectId, scope: { in: scopes } },
      orderBy: [{ scope: 'asc' }, { key: 'asc' }],
    });

    const files = categories.map((category) => {
      const normalized = category.trim();
      const inCategory = envVars.filter((envVar) =>
        normalized ? envVar.category === normalized : !envVar.category,
      );
      const merged = new Map<string, string>();
      for (const envVar of inCategory) {
        if (envVar.scope === EnvScope.SHARED && merged.has(envVar.key)) continue;
        merged.set(envVar.key, this.encryption.decrypt(envVar.valueEnc));
      }
      const content = [...merged.entries()]
        .map(([key, value]) => this.toEnvLine(key, value))
        .join('\n');
      return {
        category: normalized || 'Geral',
        filename: `${this.slugifyCategory(normalized)}.env`,
        content,
      };
    });

    await this.recordEnvVarActivity(userId, projectId, ENV_VAR_ACTIONS.exported, scope);
    return files;
  }

  private slugifyCategory(category: string): string {
    const slug = category
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return slug || 'geral';
  }

  async createProjectEnvVar(userId: string, input: CreateProjectEnvVarInput) {
    await this.tenancy.assertProjectManager(userId, input.projectId);
    const envVar = await this.prisma.projectEnvVar.create({
      data: {
        projectId: input.projectId,
        scope: input.scope,
        key: input.key,
        valueEnc: this.encryption.encrypt(input.value),
        isSecret: input.isSecret ?? true,
        category: input.category,
        description: input.description,
        updatedById: userId,
      },
    });
    await this.recordEnvVarActivity(userId, envVar.projectId, ENV_VAR_ACTIONS.created, envVar.id);
    return this.toModel(envVar);
  }

  async updateProjectEnvVar(userId: string, input: UpdateProjectEnvVarInput) {
    const existing = await this.loadEnvVarOrThrow(input.id);
    await this.tenancy.assertProjectManager(userId, existing.projectId);
    const envVar = await this.prisma.projectEnvVar.update({
      where: { id: input.id },
      data: {
        isSecret: input.isSecret,
        category: input.category,
        description: input.description,
        updatedById: userId,
        ...(input.value !== undefined ? { valueEnc: this.encryption.encrypt(input.value) } : {}),
      },
    });
    await this.recordEnvVarActivity(userId, envVar.projectId, ENV_VAR_ACTIONS.updated, envVar.id);
    return this.toModel(envVar);
  }

  async removeProjectEnvVar(userId: string, id: string) {
    const envVar = await this.loadEnvVarOrThrow(id);
    await this.tenancy.assertProjectManager(userId, envVar.projectId);
    await this.prisma.projectEnvVar.delete({ where: { id } });
    await this.recordEnvVarActivity(userId, envVar.projectId, ENV_VAR_ACTIONS.removed, id);
    return true;
  }

  private toModel(envVar: ProjectEnvVar) {
    return {
      id: envVar.id,
      projectId: envVar.projectId,
      scope: envVar.scope,
      key: envVar.key,
      isSecret: envVar.isSecret,
      category: envVar.category ?? undefined,
      description: envVar.description ?? undefined,
      value: envVar.isSecret ? undefined : this.encryption.decrypt(envVar.valueEnc),
      masked: MASK,
      updatedAt: envVar.updatedAt,
    };
  }

  private toEnvLine(key: string, value: string) {
    const needsQuotes = /[\s"#'=]/.test(value);
    if (!needsQuotes) return `${key}=${value}`;
    return `${key}="${value.replace(/"/g, '\\"')}"`;
  }

  private async recordEnvVarActivity(
    userId: string,
    projectId: string,
    action: string,
    targetId: string,
  ) {
    const orgId = await this.tenancy.resolveOrgIdByProject(projectId);
    await this.activity.recordActivity({
      orgId,
      userId,
      action,
      targetType: 'projectEnvVar',
      targetId,
    });
  }

  private async loadEnvVarOrThrow(id: string) {
    const envVar = await this.prisma.projectEnvVar.findUnique({ where: { id } });
    if (!envVar) throw new NotFoundException('Variável de ambiente não encontrada');
    return envVar;
  }
}
