import { DocStatus } from "../../../common/graphql/enums";
import { DocumentComment } from './document-comment.model';
export declare class Document {
    id: string;
    orgId: string;
    projectId?: string;
    title: string;
    authorId?: string;
    version: number;
    status: DocStatus;
    body?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    comments?: DocumentComment[];
}
