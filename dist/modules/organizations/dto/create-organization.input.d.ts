import { OrgPlan } from "../../../common/graphql/enums";
export declare class CreateOrganizationInput {
    name: string;
    slug: string;
    plan?: OrgPlan;
    region?: string;
}
