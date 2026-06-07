import { DocumentsService } from './documents.service';
import { Document } from './models/document.model';
import { DocumentComment } from './models/document-comment.model';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { User } from "../../users/models/user.model";
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
export declare class DocumentsResolver {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    listDocuments(user: AuthenticatedUser, orgId: string): Promise<Document[]>;
    listDocumentsByProject(user: AuthenticatedUser, projectId: string): Promise<Document[]>;
    findProjectOverview(user: AuthenticatedUser, projectId: string): Promise<Document | null>;
    findDocumentById(user: AuthenticatedUser, id: string): Promise<Document>;
    createDocument(user: AuthenticatedUser, input: CreateDocumentInput): Promise<Document>;
    updateDocument(user: AuthenticatedUser, input: UpdateDocumentInput): Promise<Document>;
    removeDocument(user: AuthenticatedUser, id: string): Promise<boolean>;
    addCommentToDocument(user: AuthenticatedUser, documentId: string, body: string): Promise<DocumentComment>;
    resolveDocumentComment(user: AuthenticatedUser, id: string, resolved: boolean): Promise<DocumentComment>;
    comments(document: Document): Promise<DocumentComment[]>;
}
export declare class DocumentCommentResolver {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    author(comment: DocumentComment): Promise<User>;
}
