import { MembersService } from './members.service';
import { Member } from './models/member.model';
import { User } from "../../users/models/user.model";
import { MemberRole } from "../../common/graphql/enums";
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { InviteMemberByEmailInput } from './dto/invite-member-by-email.input';
export declare class MembersResolver {
    private readonly membersService;
    constructor(membersService: MembersService);
    listMembers(user: AuthenticatedUser, orgId: string): Promise<Member[]>;
    inviteMember(user: AuthenticatedUser, orgId: string, userId: string, role?: MemberRole, title?: string): Promise<Member>;
    inviteMemberByEmail(user: AuthenticatedUser, input: InviteMemberByEmailInput): Promise<Member>;
    updateMemberRole(user: AuthenticatedUser, membershipId: string, role: MemberRole): Promise<Member>;
    removeMember(user: AuthenticatedUser, membershipId: string): Promise<boolean>;
    user(member: Member): Promise<User>;
}
