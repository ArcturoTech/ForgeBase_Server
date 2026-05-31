import { MemberRole } from "../../../common/graphql/enums";
import { User } from "../../../users/models/user.model";
export declare class Member {
    id: string;
    orgId: string;
    userId: string;
    role: MemberRole;
    title?: string;
    createdAt: Date;
    user?: User;
}
