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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_client_1 = require("../../prisma/prisma-client");
const prisma_service_1 = require("../../prisma/prisma.service");
const tenancy_service_1 = require("../../common/tenancy/tenancy.service");
const notifications_service_1 = require("../notifications/notifications.service");
const USER_FIELDS = {
    id: true,
    name: true,
    email: true,
    role: true,
    emailVerified: true,
    createdAt: true,
    updatedAt: true,
};
let DocumentsService = class DocumentsService {
    prisma;
    tenancy;
    notifications;
    constructor(prisma, tenancy, notifications) {
        this.prisma = prisma;
        this.tenancy = tenancy;
        this.notifications = notifications;
    }
    async listDocuments(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        return this.prisma.document.findMany({
            where: { orgId, projectId: null },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async listDocumentsByProject(userId, projectId) {
        await this.tenancy.assertProjectAccess(userId, projectId);
        return this.prisma.document.findMany({
            where: { projectId },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async findProjectOverviewDocument(userId, projectId) {
        await this.tenancy.assertProjectAccess(userId, projectId);
        return this.prisma.document.findFirst({
            where: { projectId, category: prisma_client_1.DocCategory.OVERVIEW },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async findDocumentById(userId, id) {
        const document = await this.loadDocumentOrThrow(id);
        await this.tenancy.assertOrgMembership(userId, document.orgId);
        return document;
    }
    async createDocument(userId, input) {
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
    async listRootDocuments(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        return this.prisma.document.findMany({
            where: { orgId, projectId: null, parentId: null },
            orderBy: [{ isFolder: 'desc' }, { title: 'asc' }],
        });
    }
    async updateDocument(userId, input) {
        const document = await this.loadDocumentOrThrow(input.id);
        await this.tenancy.assertOrgMembership(userId, document.orgId);
        const { id, body, ...rest } = input;
        return this.prisma.document.update({
            where: { id },
            data: { ...rest, ...(body !== undefined ? { body: body } : {}) },
        });
    }
    async removeDocument(userId, id) {
        const document = await this.loadDocumentOrThrow(id);
        await this.tenancy.assertOrgMembership(userId, document.orgId);
        await this.prisma.document.delete({ where: { id } });
        return true;
    }
    async addCommentToDocument(userId, documentId, body) {
        const document = await this.loadDocumentOrThrow(documentId);
        await this.tenancy.assertOrgMembership(userId, document.orgId);
        return this.prisma.documentComment.create({
            data: { documentId, authorId: userId, body },
        });
    }
    async resolveDocumentComment(userId, commentId, resolved) {
        const comment = await this.prisma.documentComment.findUnique({ where: { id: commentId } });
        if (!comment)
            throw new common_1.NotFoundException('Comentário não encontrado');
        const document = await this.loadDocumentOrThrow(comment.documentId);
        await this.tenancy.assertOrgMembership(userId, document.orgId);
        return this.prisma.documentComment.update({
            where: { id: commentId },
            data: { resolved },
        });
    }
    listCommentsByDocument(documentId) {
        return this.prisma.documentComment.findMany({
            where: { documentId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findCommentAuthor(authorId) {
        const author = await this.prisma.user.findUnique({
            where: { id: authorId },
            select: USER_FIELDS,
        });
        if (!author)
            throw new common_1.NotFoundException('Autor não encontrado');
        return author;
    }
    async listPublicDocuments(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        return this.prisma.document.findMany({
            where: { orgId, projectId: null, isPrivate: false },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async listMyDocuments(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        return this.prisma.document.findMany({
            where: { orgId, projectId: null, authorId: userId },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async listDocumentsSharedWithMe(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        const shares = await this.prisma.documentShare.findMany({
            where: { sharedWithUserId: userId, document: { orgId } },
            include: { document: true },
        });
        return shares.map((s) => s.document);
    }
    async listDocumentChildren(userId, orgId, parentId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        return this.prisma.document.findMany({
            where: { orgId, parentId },
            orderBy: [{ isFolder: 'desc' }, { title: 'asc' }],
        });
    }
    async shareDocument(userId, documentId, targetUserId) {
        const document = await this.loadDocumentOrThrow(documentId);
        await this.tenancy.assertOrgMembership(userId, document.orgId);
        if (document.authorId !== userId) {
            throw new common_1.ForbiddenException('Apenas o autor pode compartilhar este documento');
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
    async setDocumentPrivacy(userId, documentId, isPrivate) {
        const document = await this.loadDocumentOrThrow(documentId);
        await this.tenancy.assertOrgMembership(userId, document.orgId);
        if (document.authorId !== userId) {
            throw new common_1.ForbiddenException('Apenas o autor pode alterar a privacidade');
        }
        return this.prisma.document.update({ where: { id: documentId }, data: { isPrivate } });
    }
    async loadDocumentOrThrow(id) {
        const document = await this.prisma.document.findUnique({ where: { id } });
        if (!document)
            throw new common_1.NotFoundException('Documento não encontrado');
        return document;
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenancy_service_1.TenancyService,
        notifications_service_1.NotificationsService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map