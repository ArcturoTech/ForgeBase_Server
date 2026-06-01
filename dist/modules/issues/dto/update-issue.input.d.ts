import { IssueType, Priority } from "../../../common/graphql/enums";
export declare class UpdateIssueInput {
    id: string;
    title?: string;
    description?: string;
    points?: number;
    type?: IssueType;
    priority?: Priority;
    parentId?: string;
    startDate?: Date;
    dueDate?: Date;
    goal?: string;
    urgent?: boolean;
    done?: boolean;
}
