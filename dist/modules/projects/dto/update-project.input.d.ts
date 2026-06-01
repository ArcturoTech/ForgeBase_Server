import { ProjectStatus } from "../../../common/graphql/enums";
export declare class UpdateProjectInput {
    id: string;
    name?: string;
    slug?: string;
    client?: string;
    status?: ProjectStatus;
    progress?: number;
    color?: string;
    budgetCents?: number;
    spentPct?: number;
    dueLabel?: string;
    deadline?: Date;
}
