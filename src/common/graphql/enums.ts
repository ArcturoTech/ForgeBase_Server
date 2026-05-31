import { registerEnumType } from '@nestjs/graphql';
import {
  Role,
  OrgPlan,
  OrgStatus,
  MemberRole,
  ProjectStatus,
  SprintStatus,
  Priority,
  DependencyKind,
  ContractStatus,
  InvoiceStatus,
  DocStatus,
  ApiKeyStatus,
  WebhookStatus,
} from '@/prisma/prisma-client';

registerEnumType(Role, { name: 'Role' });
registerEnumType(OrgPlan, { name: 'OrgPlan' });
registerEnumType(OrgStatus, { name: 'OrgStatus' });
registerEnumType(MemberRole, { name: 'MemberRole' });
registerEnumType(ProjectStatus, { name: 'ProjectStatus' });
registerEnumType(SprintStatus, { name: 'SprintStatus' });
registerEnumType(Priority, { name: 'Priority' });
registerEnumType(DependencyKind, { name: 'DependencyKind' });
registerEnumType(ContractStatus, { name: 'ContractStatus' });
registerEnumType(InvoiceStatus, { name: 'InvoiceStatus' });
registerEnumType(DocStatus, { name: 'DocStatus' });
registerEnumType(ApiKeyStatus, { name: 'ApiKeyStatus' });
registerEnumType(WebhookStatus, { name: 'WebhookStatus' });

export {
  Role,
  OrgPlan,
  OrgStatus,
  MemberRole,
  ProjectStatus,
  SprintStatus,
  Priority,
  DependencyKind,
  ContractStatus,
  InvoiceStatus,
  DocStatus,
  ApiKeyStatus,
  WebhookStatus,
};
