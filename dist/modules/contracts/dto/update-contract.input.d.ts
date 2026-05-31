import { ContractStatus } from "../../../common/graphql/enums";
export declare class UpdateContractInput {
    id: string;
    clientName?: string;
    name?: string;
    valueLabel?: string;
    status?: ContractStatus;
    expiresAt?: Date;
}
