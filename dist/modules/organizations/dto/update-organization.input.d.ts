import { OrgPlan, OrgStatus } from "../../../common/graphql/enums";
export declare class UpdateOrganizationInput {
    id: string;
    name?: string;
    slug?: string;
    plan?: OrgPlan;
    status?: OrgStatus;
    region?: string;
    mrrCents?: number;
}
