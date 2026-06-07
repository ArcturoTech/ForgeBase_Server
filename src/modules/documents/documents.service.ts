import { Injectable, NotFoundException } from '@nestjs/common';
import { DocCategory, Prisma } from '@/prisma/prisma-client';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
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
  ) {}

  async listDocuments(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.document.findMany({
      where: { orgId },
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
      },
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

  private async loadDocumentOrThrow(id: string) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) throw new NotFoundException('Documento não encontrado');
    return document;
  }
}
