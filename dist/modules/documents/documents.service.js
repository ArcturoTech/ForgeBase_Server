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
let DocumentsService = class DocumentsService {
    prisma;
    tenancy;
    constructor(prisma, tenancy) {
        this.prisma = prisma;
        this.tenancy = tenancy;
    }
    async listDocuments(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        return this.prisma.document.findMany({
            where: { orgId },
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
                title: input.title,
                version: input.version,
                status: input.status,
            },
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
        tenancy_service_1.TenancyService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map