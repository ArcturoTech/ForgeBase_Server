import { User } from "../../../users/models/user.model";
export declare class IssueComment {
    id: string;
    issueId: string;
    authorId: string;
    body: string;
    createdAt: Date;
    author?: User;
}
