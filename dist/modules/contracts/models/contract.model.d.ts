import { ContractStatus } from "../../../common/graphql/enums";
export declare class Contract {
    id: string;
    orgId: string;
    projectId?: string;
    number: string;
    clientName: string;
    name: string;
    valueLabel: string;
    status: ContractStatus;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
