import { ApiKeyStatus } from "../../../common/graphql/enums";
export declare class ApiKey {
    id: string;
    name: string;
    prefix: string;
    scope: string;
    status: ApiKeyStatus;
    lastUsedAt?: Date;
    callCount: number;
    createdAt: Date;
}
