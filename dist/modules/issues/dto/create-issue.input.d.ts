import { Priority } from "../../../common/graphql/enums";
export declare class CreateIssueInput {
    orgId: string;
    boardId: string;
    columnId: string;
    sprintId?: string;
    title: string;
    description?: string;
    points?: number;
    priority?: Priority;
    assigneeIds?: string[];
    labelIds?: string[];
}
