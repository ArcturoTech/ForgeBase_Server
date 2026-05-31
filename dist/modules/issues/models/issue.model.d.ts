import { Priority } from "../../../common/graphql/enums";
import { User } from "../../../users/models/user.model";
import { Label } from './label.model';
import { Subtask } from './subtask.model';
import { IssueComment } from './issue-comment.model';
export declare class Issue {
    id: string;
    orgId: string;
    boardId: string;
    columnId: string;
    sprintId?: string;
    key: string;
    title: string;
    description?: string;
    points?: number;
    priority: Priority;
    position: number;
    urgent: boolean;
    done: boolean;
    epic?: string;
    reporterId?: string;
    createdAt: Date;
    updatedAt: Date;
    assignees?: User[];
    labels?: Label[];
    subtasks?: Subtask[];
    comments?: IssueComment[];
}
