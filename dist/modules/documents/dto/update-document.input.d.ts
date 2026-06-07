import { DocCategory, DocStatus } from "../../../common/graphql/enums";
export declare class UpdateDocumentInput {
    id: string;
    title?: string;
    category?: DocCategory;
    parentId?: string;
    body?: Record<string, unknown>;
    status?: DocStatus;
    version?: number;
}
