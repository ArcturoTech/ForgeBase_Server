import { SprintClosureType, SprintStatus } from "../../../common/graphql/enums";
export declare class Sprint {
    id: string;
    projectId: string;
    number: number;
    name: string;
    code?: string;
    status: SprintStatus;
    closedAs?: SprintClosureType;
    parentSprintId?: string;
    startDate?: Date;
    endDate?: Date;
    totalPoints: number;
    targetPoints?: number;
    createdAt: Date;
}
