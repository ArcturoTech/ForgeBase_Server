import { User } from "../../../users/models/user.model";
export declare class Activity {
    id: string;
    action: string;
    targetType?: string;
    targetId?: string;
    createdAt: Date;
    actor?: User;
}
