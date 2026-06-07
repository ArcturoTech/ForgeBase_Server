import { Prisma } from "../../prisma/prisma-client";
import { PrismaService } from "../../prisma/prisma.service";
import { TenancyService } from "../../common/tenancy/tenancy.service";
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
export declare class DocumentsService {
    private readonly prisma;
    private readonly tenancy;
    constructor(prisma: PrismaService, tenancy: TenancyService);
    listDocuments(userId: string, orgId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string | null;
        body: Prisma.JsonValue | null;
        orgId: string;
        version: number;
        title: string;
        status: import("generated/prisma").$Enums.DocStatus;
        projectId: string | null;
        parentId: string | null;
        category: import("generated/prisma").$Enums.DocCategory;
    }[]>;
    listDocumentsByProject(userId: string, projectId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string | null;
        body: Prisma.JsonValue | null;
        orgId: string;
        version: number;
        title: string;
        status: import("generated/prisma").$Enums.DocStatus;
        projectId: string | null;
        parentId: string | null;
        category: import("generated/prisma").$Enums.DocCategory;
    }[]>;
    findProjectOverviewDocument(userId: string, projectId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string | null;
        body: Prisma.JsonValue | null;
        orgId: string;
        version: number;
        title: string;
        status: import("generated/prisma").$Enums.DocStatus;
        projectId: string | null;
        parentId: string | null;
        category: import("generated/prisma").$Enums.DocCategory;
    } | null>;
    findDocumentById(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string | null;
        body: Prisma.JsonValue | null;
        orgId: string;
        version: number;
        title: string;
        status: import("generated/prisma").$Enums.DocStatus;
        projectId: string | null;
        parentId: string | null;
        category: import("generated/prisma").$Enums.DocCategory;
    }>;
    createDocument(userId: string, input: CreateDocumentInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string | null;
        body: Prisma.JsonValue | null;
        orgId: string;
        version: number;
        title: string;
        status: import("generated/prisma").$Enums.DocStatus;
        projectId: string | null;
        parentId: string | null;
        category: import("generated/prisma").$Enums.DocCategory;
    }>;
    updateDocument(userId: string, input: UpdateDocumentInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string | null;
        body: Prisma.JsonValue | null;
        orgId: string;
        version: number;
        title: string;
        status: import("generated/prisma").$Enums.DocStatus;
        projectId: string | null;
        parentId: string | null;
        category: import("generated/prisma").$Enums.DocCategory;
    }>;
    removeDocument(userId: string, id: string): Promise<boolean>;
    addCommentToDocument(userId: string, documentId: string, body: string): Promise<{
        id: string;
        createdAt: Date;
        authorId: string;
        body: string;
        resolved: boolean;
        documentId: string;
    }>;
    resolveDocumentComment(userId: string, commentId: string, resolved: boolean): Promise<{
        id: string;
        createdAt: Date;
        authorId: string;
        body: string;
        resolved: boolean;
        documentId: string;
    }>;
    listCommentsByDocument(documentId: string): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        authorId: string;
        body: string;
        resolved: boolean;
        documentId: string;
    }[]>;
    findCommentAuthor(authorId: string): Promise<{
        name: string | null;
        id: string;
        email: string;
        role: import("generated/prisma").$Enums.Role;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private loadDocumentOrThrow;
}
