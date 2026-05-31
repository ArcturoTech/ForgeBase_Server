import { User } from "../../../users/models/user.model";
export declare class DocumentComment {
    id: string;
    documentId: string;
    authorId: string;
    body: string;
    resolved: boolean;
    createdAt: Date;
    author?: User;
}
