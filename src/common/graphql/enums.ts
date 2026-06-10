import { registerEnumType } from '@nestjs/graphql';
import {
  Role,
  OrgPlan,
  OrgStatus,
  MemberRole,
  InvitationStatus,
  ProjectStatus,
  SprintStatus,
  IssueType,
  Priority,
  DependencyKind,
  ContractStatus,
  InvoiceStatus,
  DocStatus,
  DocCategory,
  ApiKeyStatus,
  WebhookStatus,
  ChannelType,
  ChannelMemberRole,
  ChatSpaceKind,
  ChatSpaceRole,
  EnvScope,
  ResourceType,
} from '@/prisma/prisma-client';

registerEnumType(Role, { name: 'Role' });
registerEnumType(OrgPlan, { name: 'OrgPlan' });
registerEnumType(OrgStatus, { name: 'OrgStatus' });
registerEnumType(MemberRole, { name: 'MemberRole' });
registerEnumType(InvitationStatus, { name: 'InvitationStatus' });
registerEnumType(ProjectStatus, { name: 'ProjectStatus' });
registerEnumType(SprintStatus, { name: 'SprintStatus' });
registerEnumType(IssueType, { name: 'IssueType' });
registerEnumType(Priority, { name: 'Priority' });
registerEnumType(DependencyKind, { name: 'DependencyKind' });
registerEnumType(ContractStatus, { name: 'ContractStatus' });
registerEnumType(InvoiceStatus, { name: 'InvoiceStatus' });
registerEnumType(DocStatus, { name: 'DocStatus' });
registerEnumType(DocCategory, { name: 'DocCategory' });
registerEnumType(ApiKeyStatus, { name: 'ApiKeyStatus' });
registerEnumType(WebhookStatus, { name: 'WebhookStatus' });
registerEnumType(ChannelType, { name: 'ChannelType' });
registerEnumType(ChannelMemberRole, { name: 'ChannelMemberRole' });
registerEnumType(ChatSpaceKind, { name: 'ChatSpaceKind' });
registerEnumType(ChatSpaceRole, { name: 'ChatSpaceRole' });
registerEnumType(EnvScope, { name: 'EnvScope' });
registerEnumType(ResourceType, { name: 'ResourceType' });

export {
  Role,
  OrgPlan,
  OrgStatus,
  MemberRole,
  InvitationStatus,
  ProjectStatus,
  SprintStatus,
  IssueType,
  Priority,
  DependencyKind,
  ContractStatus,
  InvoiceStatus,
  DocStatus,
  DocCategory,
  ApiKeyStatus,
  WebhookStatus,
  ChannelType,
  ChannelMemberRole,
  ChatSpaceKind,
  ChatSpaceRole,
  EnvScope,
  ResourceType,
};
