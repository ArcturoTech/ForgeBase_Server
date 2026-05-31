import { DocStatus } from "../../../common/graphql/enums";
export declare class CreateDocumentInput {
    orgId: string;
    projectId?: string;
    title: string;
    version?: number;
    status?: DocStatus;
}
