import { InvoiceStatus } from "../../../common/graphql/enums";
export declare class CreateInvoiceInput {
    orgId: string;
    projectId?: string;
    number: string;
    clientName: string;
    amountCents: number;
    issueDate?: Date;
    dueDate?: Date;
    status?: InvoiceStatus;
}
