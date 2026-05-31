import { SprintStatus } from "../../../common/graphql/enums";
export declare class Sprint {
    id: string;
    projectId: string;
    number: number;
    name: string;
    code?: string;
    status: SprintStatus;
    startDate?: Date;
    endDate?: Date;
    totalPoints: number;
    targetPoints?: number;
    createdAt: Date;
}
