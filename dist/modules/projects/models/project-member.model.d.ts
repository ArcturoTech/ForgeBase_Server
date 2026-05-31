import { User } from "../../../users/models/user.model";
export declare class ProjectMember {
    id: string;
    projectId: string;
    userId: string;
    role: string;
    hours: number;
    user?: User;
}
