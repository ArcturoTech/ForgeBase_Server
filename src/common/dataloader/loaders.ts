import DataLoader from 'dataloader';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@/users/models/user.model';
import { Label } from '@/modules/issues/models/label.model';
import { Subtask } from '@/modules/issues/models/subtask.model';
import { IssueComment } from '@/modules/issues/models/issue-comment.model';

const USER_FIELDS = {
  id: true,
  name: true,
  email: true,
  role: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

export interface AppLoaders {
  issueAssignees: DataLoader<string, User[]>;
  issueLabels: DataLoader<string, Label[]>;
  issueSubtasks: DataLoader<string, Subtask[]>;
  issueComments: DataLoader<string, IssueComment[]>;
}

function groupByIssueId<Row extends { issueId: string }, T>(rows: Row[], value: (row: Row) => T) {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const bucket = map.get(row.issueId) ?? [];
    bucket.push(value(row));
    map.set(row.issueId, bucket);
  }
  return map;
}

export function createLoaders(prisma: PrismaService): AppLoaders {
  return {
    issueAssignees: new DataLoader<string, User[]>(async (issueIds) => {
      const rows = await prisma.issueAssignee.findMany({
        where: { issueId: { in: [...issueIds] } },
        include: { user: { select: USER_FIELDS } },
      });
      const grouped = groupByIssueId(rows, (row) => row.user as User);
      return issueIds.map((id) => grouped.get(id) ?? []);
    }),
    issueLabels: new DataLoader<string, Label[]>(async (issueIds) => {
      const rows = await prisma.issueLabel.findMany({
        where: { issueId: { in: [...issueIds] } },
        include: { label: true },
      });
      const grouped = groupByIssueId(rows, (row) => row.label as Label);
      return issueIds.map((id) => grouped.get(id) ?? []);
    }),
    issueSubtasks: new DataLoader<string, Subtask[]>(async (issueIds) => {
      const rows = await prisma.subtask.findMany({
        where: { issueId: { in: [...issueIds] } },
        orderBy: { position: 'asc' },
      });
      const grouped = groupByIssueId(rows, (row) => row as Subtask);
      return issueIds.map((id) => grouped.get(id) ?? []);
    }),
    issueComments: new DataLoader<string, IssueComment[]>(async (issueIds) => {
      const rows = await prisma.comment.findMany({
        where: { issueId: { in: [...issueIds] } },
        orderBy: { createdAt: 'asc' },
        include: { author: { select: USER_FIELDS } },
      });
      const grouped = groupByIssueId(rows, (row) => row as unknown as IssueComment);
      return issueIds.map((id) => grouped.get(id) ?? []);
    }),
  };
}
