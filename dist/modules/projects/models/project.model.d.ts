import { ProjectStatus } from "../../../common/graphql/enums";
import { ProjectMember } from './project-member.model';
export declare class Project {
    id: string;
    orgId: string;
    name: string;
    slug: string;
    client?: string;
    status: ProjectStatus;
    progress: number;
    color: string;
    budgetCents: number;
    spentPct: number;
    dueLabel?: string;
    createdAt: Date;
    updatedAt: Date;
    members?: ProjectMember[];
}
