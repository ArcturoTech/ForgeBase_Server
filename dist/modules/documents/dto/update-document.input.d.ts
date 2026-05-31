import { DocStatus } from "../../../common/graphql/enums";
export declare class UpdateDocumentInput {
    id: string;
    title?: string;
    body?: Record<string, unknown>;
    status?: DocStatus;
    version?: number;
}
