import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { IssuesService } from '@/modules/issues/issues.service';
import { AttachmentsService } from '@/modules/attachments/attachments.service';
import { IssueType, Priority } from '@/common/graphql/enums';
import { SubmitIntakeFormInput } from './dto/submit-intake-form.input';

type IntakeAttachmentRef = { filename: string; url: string };

@Injectable()
export class IntakeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
    private readonly issues: IssuesService,
    private readonly attachments: AttachmentsService,
  ) {}

  private generateToken(): string {
    // URL-safe, ~24 chars, unguessable. The form is shared by link, so the token IS the secret.
    return randomBytes(18).toString('base64url');
  }

  /**
   * Returns the project's intake form, creating it on first call. "Generated once":
   * the form (and its token) is unique per project (DB-enforced), so calling again
   * returns the same stable link.
   */
  async ensureProjectForm(userId: string, projectId: string) {
    await this.tenancy.assertProjectAccess(userId, projectId);

    const existing = await this.prisma.intakeForm.findUnique({ where: { projectId } });
    if (existing) return existing;

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        boards: {
          orderBy: { createdAt: 'asc' },
          take: 1,
          include: { columns: { orderBy: { position: 'asc' }, take: 1 } },
        },
      },
    });
    if (!project) throw new NotFoundException('Projeto não encontrado');

    const existingBoard = project.boards[0];
    let boardId = existingBoard?.id;
    let columnId = existingBoard?.columns[0]?.id;

    if (!boardId || !columnId) {
      const board = await this.prisma.board.create({
        data: {
          projectId: project.id,
          name: 'Quadro',
          columns: {
            create: [
              { name: 'A fazer', position: 0 },
              { name: 'Em progresso', position: 1 },
              { name: 'Concluído', position: 2, isDone: true },
            ],
          },
        },
        include: { columns: { orderBy: { position: 'asc' }, take: 1 } },
      });
      boardId = board.id;
      columnId = board.columns[0].id;
    }

    return this.prisma.intakeForm.create({
      data: {
        token: this.generateToken(),
        orgId: project.orgId,
        projectId: project.id,
        boardId,
        columnId,
        title: `Reportar para ${project.name}`,
        defaultType: IssueType.BUG,
        createdById: userId,
      },
    });
  }

  /** Authenticated: existing form for a project, or null. */
  async getProjectForm(userId: string, projectId: string) {
    await this.tenancy.assertProjectAccess(userId, projectId);
    return this.prisma.intakeForm.findUnique({ where: { projectId } });
  }

  /** Authenticated: enable/disable the public form without deleting it (link stays valid). */
  async setActive(userId: string, projectId: string, active: boolean) {
    await this.tenancy.assertProjectAccess(userId, projectId);
    const form = await this.prisma.intakeForm.findUnique({ where: { projectId } });
    if (!form) throw new NotFoundException('Formulário não encontrado');
    return this.prisma.intakeForm.update({ where: { id: form.id }, data: { active } });
  }

  /** Public: config the external page renders. Only safe, non-internal fields. */
  async getPublicFormByToken(token: string) {
    const form = await this.prisma.intakeForm.findUnique({
      where: { token },
      include: {
        project: { select: { name: true } },
        organization: { select: { name: true } },
      },
    });
    if (!form || !form.active) {
      throw new NotFoundException('Formulário não encontrado ou desativado');
    }
    return {
      token: form.token,
      title: form.title,
      description: form.description ?? undefined,
      projectName: form.project.name,
      orgName: form.organization.name,
      defaultType: form.defaultType,
    };
  }

  /** Public: loads an active form by token, used by submit and the public upload. */
  private async loadActiveForm(token: string) {
    const form = await this.prisma.intakeForm.findUnique({ where: { token } });
    if (!form || !form.active) {
      throw new NotFoundException('Formulário não encontrado ou desativado');
    }
    return form;
  }

  /** Public: resolves the org an active form belongs to (for anonymous uploads). */
  async resolveActiveFormOrgId(token: string) {
    const form = await this.loadActiveForm(token);
    return form.orgId;
  }

  /** Public: a submission. Creates a backlog issue + a submission record. */
  async submitByToken(token: string, input: SubmitIntakeFormInput) {
    // Honeypot: bots fill the hidden field. Pretend success, create nothing.
    if (input.company && input.company.trim().length > 0) {
      return { ok: true };
    }

    const form = await this.loadActiveForm(token);

    const attachments = input.attachmentIds?.length
      ? await this.attachments.resolvePendingIntakeAttachments(form.orgId, input.attachmentIds)
      : [];

    const issue = await this.issues.createBacklogIssueFromIntake({
      orgId: form.orgId,
      boardId: form.boardId,
      columnId: form.columnId,
      title: input.title,
      description: this.composeDescription(input, attachments),
      type: input.type ?? form.defaultType,
      priority: input.priority ?? Priority.MED,
    });

    if (attachments.length) {
      await this.attachments.linkIntakeAttachmentsToIssue(
        attachments.map((attachment) => attachment.id),
        issue.id,
      );
    }

    await this.prisma.intakeSubmission.create({
      data: {
        formId: form.id,
        issueId: issue.id,
        reporterName: input.reporterName,
        reporterEmail: input.reporterEmail,
      },
    });

    return { ok: true };
  }

  /** Folds the reporter's contact and attachment links into the issue description. */
  private composeDescription(
    input: SubmitIntakeFormInput,
    attachments: IntakeAttachmentRef[],
  ): string {
    const lines: string[] = [];
    if (input.description) lines.push(input.description.trim());
    const who = [input.reporterName, input.reporterEmail].filter(Boolean).join(' · ');
    if (who) {
      if (lines.length) lines.push('');
      lines.push(`— Reportado por ${who} (via formulário público)`);
    }
    if (attachments.length) {
      lines.push('');
      lines.push('Anexos:');
      for (const attachment of attachments) {
        lines.push(`- ${attachment.filename}: ${attachment.url}`);
      }
    }
    return lines.join('\n');
  }
}
