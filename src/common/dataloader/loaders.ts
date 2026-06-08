import DataLoader from 'dataloader';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@/users/models/user.model';
import { Label } from '@/modules/issues/models/label.model';
import { Subtask } from '@/modules/issues/models/subtask.model';
import { IssueComment } from '@/modules/issues/models/issue-comment.model';
import { ReactionGroup } from '@/modules/chat/models/reaction-group.model';
import { Attachment } from '@/modules/attachments/models/attachment.model';
import { Message } from '@/modules/chat/models/message.model';

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
  messageReactions: DataLoader<string, ReactionGroup[]>;
  messageAttachments: DataLoader<string, Attachment[]>;
  messageById: DataLoader<string, Message | null>;
}

function groupReactionsByEmoji(
  rows: { messageId: string; userId: string; emoji: string }[],
  currentUserId: string | null,
) {
  const byMessage = new Map<string, Map<string, ReactionGroup>>();
  for (const row of rows) {
    const emojiMap = byMessage.get(row.messageId) ?? new Map<string, ReactionGroup>();
    const group =
      emojiMap.get(row.emoji) ??
      ({ emoji: row.emoji, count: 0, reactedByMe: false, userIds: [] } as ReactionGroup);
    group.count += 1;
    group.userIds.push(row.userId);
    if (currentUserId && row.userId === currentUserId) group.reactedByMe = true;
    emojiMap.set(row.emoji, group);
    byMessage.set(row.messageId, emojiMap);
  }
  return byMessage;
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

export function createLoaders(prisma: PrismaService, currentUserId: string | null = null): AppLoaders {
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
    messageReactions: new DataLoader<string, ReactionGroup[]>(async (messageIds) => {
      const rows = await prisma.messageReaction.findMany({
        where: { messageId: { in: [...messageIds] } },
        orderBy: { createdAt: 'asc' },
        select: { messageId: true, userId: true, emoji: true },
      });
      const grouped = groupReactionsByEmoji(rows, currentUserId);
      return messageIds.map((id) => [...(grouped.get(id)?.values() ?? [])]);
    }),
    messageAttachments: new DataLoader<string, Attachment[]>(async (messageIds) => {
      const rows = await prisma.messageAttachment.findMany({
        where: { messageId: { in: [...messageIds] } },
        include: { attachment: true },
        orderBy: { attachment: { createdAt: 'asc' } },
      });
      const grouped = new Map<string, Attachment[]>();
      for (const row of rows) {
        const bucket = grouped.get(row.messageId) ?? [];
        bucket.push(row.attachment as unknown as Attachment);
        grouped.set(row.messageId, bucket);
      }
      return messageIds.map((id) => grouped.get(id) ?? []);
    }),
    messageById: new DataLoader<string, Message | null>(async (messageIds) => {
      const rows = await prisma.message.findMany({
        where: { id: { in: [...messageIds] } },
        include: { author: { select: USER_FIELDS } },
      });
      const byId = new Map<string, Message>();
      for (const row of rows) byId.set(row.id, row as unknown as Message);
      return messageIds.map((id) => byId.get(id) ?? null);
    }),
  };
}
