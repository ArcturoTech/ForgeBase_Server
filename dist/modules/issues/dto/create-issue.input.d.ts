import { IssueType, Priority } from "../../../common/graphql/enums";
export declare class CreateIssueInput {
    orgId: string;
    boardId: string;
    columnId: string;
    sprintId?: string;
    title: string;
    description?: string;
    points?: number;
    type?: IssueType;
    priority?: Priority;
    parentId?: string;
    startDate?: Date;
    dueDate?: Date;
    goal?: string;
    assigneeIds?: string[];
    labelIds?: string[];
    standalone?: boolean;
}
