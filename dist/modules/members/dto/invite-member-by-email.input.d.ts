import { MemberRole } from "../../../common/graphql/enums";
export declare class InviteMemberByEmailInput {
    orgId: string;
    email: string;
    role?: MemberRole;
    title?: string;
}
