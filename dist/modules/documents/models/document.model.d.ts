import { DocCategory, DocStatus } from "../../../common/graphql/enums";
import { DocumentComment } from './document-comment.model';
export declare class Document {
    id: string;
    orgId: string;
    projectId?: string;
    parentId?: string;
    title: string;
    authorId?: string;
    version: number;
    status: DocStatus;
    category: DocCategory;
    body?: Record<string, unknown>;
    isPrivate: boolean;
    isFolder: boolean;
    createdAt: Date;
    updatedAt: Date;
    comments?: DocumentComment[];
}
