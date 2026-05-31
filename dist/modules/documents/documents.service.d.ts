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
        orgId: string;
        projectId: string | null;
        title: string;
        authorId: string | null;
        version: number;
        status: import("generated/prisma").$Enums.DocStatus;
        body: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findDocumentById(userId: string, id: string): Promise<{
        id: string;
        orgId: string;
        projectId: string | null;
        title: string;
        authorId: string | null;
        version: number;
        status: import("generated/prisma").$Enums.DocStatus;
        body: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createDocument(userId: string, input: CreateDocumentInput): Promise<{
        id: string;
        orgId: string;
        projectId: string | null;
        title: string;
        authorId: string | null;
        version: number;
        status: import("generated/prisma").$Enums.DocStatus;
        body: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateDocument(userId: string, input: UpdateDocumentInput): Promise<{
        id: string;
        orgId: string;
        projectId: string | null;
        title: string;
        authorId: string | null;
        version: number;
        status: import("generated/prisma").$Enums.DocStatus;
        body: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeDocument(userId: string, id: string): Promise<boolean>;
    addCommentToDocument(userId: string, documentId: string, body: string): Promise<{
        id: string;
        authorId: string;
        body: string;
        createdAt: Date;
        resolved: boolean;
        documentId: string;
    }>;
    listCommentsByDocument(documentId: string): Prisma.PrismaPromise<{
        id: string;
        authorId: string;
        body: string;
        createdAt: Date;
        resolved: boolean;
        documentId: string;
    }[]>;
    findCommentAuthor(authorId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        role: import("generated/prisma").$Enums.Role;
        emailVerified: boolean;
    }>;
    private loadDocumentOrThrow;
}
