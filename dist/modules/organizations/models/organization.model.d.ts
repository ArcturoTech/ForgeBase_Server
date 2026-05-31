import { OrgPlan, OrgStatus } from "../../../common/graphql/enums";
export declare class Organization {
    id: string;
    name: string;
    slug: string;
    plan: OrgPlan;
    status: OrgStatus;
    region: string;
    databaseName?: string;
    mrrCents: number;
    trialEndsAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
