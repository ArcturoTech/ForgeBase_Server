import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DocCategory, Prisma } from '@/prisma/prisma-client';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';

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
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
    private readonly notifications: NotificationsService,
  ) {}

  async listDocuments(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.document.findMany({
      where: { orgId, projectId: null },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async listDocumentsByProject(userId: string, projectId: string) {
    await this.tenancy.assertProjectAccess(userId, projectId);
    return this.prisma.document.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findProjectOverviewDocument(userId: string, projectId: string) {
    await this.tenancy.assertProjectAccess(userId, projectId);
    return this.prisma.document.findFirst({
      where: { projectId, category: DocCategory.OVERVIEW },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findDocumentById(userId: string, id: string) {
    const document = await this.loadDocumentOrThrow(id);
    await this.tenancy.assertOrgMembership(userId, document.orgId);
    return document;
  }

  async createDocument(userId: string, input: CreateDocumentInput) {
    await this.tenancy.assertOrgMembership(userId, input.orgId);
    return this.prisma.document.create({
      data: {
        orgId: input.orgId,
        projectId: input.projectId,
        parentId: input.parentId,
        title: input.title,
        version: input.version,
        status: input.status,
        category: input.category,
        isFolder: input.isFolder ?? false,
        authorId: userId,
      },
    });
  }

  async listRootDocuments(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.document.findMany({
      where: { orgId, projectId: null, parentId: null },
      orderBy: [{ isFolder: 'desc' }, { title: 'asc' }],
    });
  }

  async updateDocument(userId: string, input: UpdateDocumentInput) {
    const document = await this.loadDocumentOrThrow(input.id);
    await this.tenancy.assertOrgMembership(userId, document.orgId);
    const { id, body, ...rest } = input;
    return this.prisma.document.update({
      where: { id },
      data: { ...rest, ...(body !== undefined ? { body: body as Prisma.InputJsonValue } : {}) },
    });
  }

  async removeDocument(userId: string, id: string) {
    const document = await this.loadDocumentOrThrow(id);
    await this.tenancy.assertOrgMembership(userId, document.orgId);
    await this.prisma.document.delete({ where: { id } });
    return true;
  }

  async addCommentToDocument(userId: string, documentId: string, body: string) {
    const document = await this.loadDocumentOrThrow(documentId);
    await this.tenancy.assertOrgMembership(userId, document.orgId);
    return this.prisma.documentComment.create({
      data: { documentId, authorId: userId, body },
    });
  }

  async resolveDocumentComment(userId: string, commentId: string, resolved: boolean) {
    const comment = await this.prisma.documentComment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comentário não encontrado');
    const document = await this.loadDocumentOrThrow(comment.documentId);
    await this.tenancy.assertOrgMembership(userId, document.orgId);
    return this.prisma.documentComment.update({
      where: { id: commentId },
      data: { resolved },
    });
  }

  listCommentsByDocument(documentId: string) {
    return this.prisma.documentComment.findMany({
      where: { documentId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findCommentAuthor(authorId: string) {
    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
      select: USER_FIELDS,
    });
    if (!author) throw new NotFoundException('Autor não encontrado');
    return author;
  }

  async listPublicDocuments(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.document.findMany({
      where: { orgId, projectId: null, isPrivate: false },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async listMyDocuments(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.document.findMany({
      where: { orgId, projectId: null, authorId: userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async listDocumentsSharedWithMe(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    const shares = await this.prisma.documentShare.findMany({
      where: { sharedWithUserId: userId, document: { orgId } },
      include: { document: true },
    });
    return shares.map((s) => s.document);
  }

  async listDocumentChildren(userId: string, orgId: string, parentId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.document.findMany({
      where: { orgId, parentId },
      orderBy: [{ isFolder: 'desc' }, { title: 'asc' }],
    });
  }

  async shareDocument(userId: string, documentId: string, targetUserId: string) {
    const document = await this.loadDocumentOrThrow(documentId);
    await this.tenancy.assertOrgMembership(userId, document.orgId);
    if (document.authorId !== userId) {
      throw new ForbiddenException('Apenas o autor pode compartilhar este documento');
    }
    const share = await this.prisma.documentShare.upsert({
      where: { documentId_sharedWithUserId: { documentId, sharedWithUserId: targetUserId } },
      create: { documentId, sharedWithUserId: targetUserId, grantedById: userId },
      update: {},
    });
    void this.notifications.createNotificationInternal({
      orgId: document.orgId,
      userId: targetUserId,
      type: 'DOCUMENT_SHARED',
      title: `Documento compartilhado: ${document.title}`,
    });
    return share;
  }

  async setDocumentPrivacy(userId: string, documentId: string, isPrivate: boolean) {
    const document = await this.loadDocumentOrThrow(documentId);
    await this.tenancy.assertOrgMembership(userId, document.orgId);
    if (document.authorId !== userId) {
      throw new ForbiddenException('Apenas o autor pode alterar a privacidade');
    }
    return this.prisma.document.update({ where: { id: documentId }, data: { isPrivate } });
  }

  private async loadDocumentOrThrow(id: string) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) throw new NotFoundException('Documento não encontrado');
    return document;
  }
}
