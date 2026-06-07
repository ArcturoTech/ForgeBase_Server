import { DocCategory, DocStatus } from "../../../common/graphql/enums";
export declare class CreateDocumentInput {
    orgId: string;
    projectId?: string;
    parentId?: string;
    title: string;
    category?: DocCategory;
    version?: number;
    status?: DocStatus;
}
