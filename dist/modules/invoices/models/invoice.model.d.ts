import { InvoiceStatus } from "../../../common/graphql/enums";
export declare class Invoice {
    id: string;
    orgId: string;
    projectId?: string;
    number: string;
    clientName: string;
    amountCents: number;
    issueDate?: Date;
    dueDate?: Date;
    status: InvoiceStatus;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
