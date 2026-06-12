import { Role, OrgPlan, OrgStatus, MemberRole, InvitationStatus, ProjectStatus, SprintStatus, SprintClosureType, IssueType, Priority, DependencyKind, ContractStatus, InvoiceStatus, DocStatus, DocCategory, ApiKeyStatus, WebhookStatus, ChannelType, ChannelMemberRole, ChatSpaceKind, ChatSpaceRole, EnvScope, ResourceType, PresenceStatus, PersonalTaskStatus, PersonalSprintStatus } from "../../prisma/prisma-client";
declare enum CloseSprintAction {
    MOVE_TO_BACKLOG = "MOVE_TO_BACKLOG",
    MARK_DONE = "MARK_DONE",
    CLOSE_INCOMPLETE = "CLOSE_INCOMPLETE"
}
export { Role, OrgPlan, OrgStatus, MemberRole, InvitationStatus, ProjectStatus, SprintStatus, SprintClosureType, IssueType, Priority, DependencyKind, ContractStatus, InvoiceStatus, DocStatus, DocCategory, ApiKeyStatus, WebhookStatus, ChannelType, ChannelMemberRole, ChatSpaceKind, ChatSpaceRole, EnvScope, ResourceType, PresenceStatus, PersonalTaskStatus, PersonalSprintStatus, CloseSprintAction, };
