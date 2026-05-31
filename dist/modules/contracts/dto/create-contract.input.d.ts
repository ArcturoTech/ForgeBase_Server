import { ContractStatus } from "../../../common/graphql/enums";
export declare class CreateContractInput {
    orgId: string;
    projectId?: string;
    number: string;
    clientName: string;
    name: string;
    valueLabel: string;
    status?: ContractStatus;
    expiresAt?: Date;
}
