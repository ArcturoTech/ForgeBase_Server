"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoaders = createLoaders;
const dataloader_1 = __importDefault(require("dataloader"));
const USER_FIELDS = {
    id: true,
    name: true,
    email: true,
    role: true,
    emailVerified: true,
    createdAt: true,
    updatedAt: true,
};
function groupReactionsByEmoji(rows, currentUserId) {
    const byMessage = new Map();
    for (const row of rows) {
        const emojiMap = byMessage.get(row.messageId) ?? new Map();
        const group = emojiMap.get(row.emoji) ??
            { emoji: row.emoji, count: 0, reactedByMe: false, userIds: [] };
        group.count += 1;
        group.userIds.push(row.userId);
        if (currentUserId && row.userId === currentUserId)
            group.reactedByMe = true;
        emojiMap.set(row.emoji, group);
        byMessage.set(row.messageId, emojiMap);
    }
    return byMessage;
}
function groupByIssueId(rows, value) {
    const map = new Map();
    for (const row of rows) {
        const bucket = map.get(row.issueId) ?? [];
        bucket.push(value(row));
        map.set(row.issueId, bucket);
    }
    return map;
}
function createLoaders(prisma, currentUserId = null) {
    return {
        issueAssignees: new dataloader_1.default(async (issueIds) => {
            const rows = await prisma.issueAssignee.findMany({
                where: { issueId: { in: [...issueIds] } },
                include: { user: { select: USER_FIELDS } },
            });
            const grouped = groupByIssueId(rows, (row) => row.user);
            return issueIds.map((id) => grouped.get(id) ?? []);
        }),
        issueLabels: new dataloader_1.default(async (issueIds) => {
            const rows = await prisma.issueLabel.findMany({
                where: { issueId: { in: [...issueIds] } },
                include: { label: true },
            });
            const grouped = groupByIssueId(rows, (row) => row.label);
            return issueIds.map((id) => grouped.get(id) ?? []);
        }),
        issueSubtasks: new dataloader_1.default(async (issueIds) => {
            const rows = await prisma.subtask.findMany({
                where: { issueId: { in: [...issueIds] } },
                orderBy: { position: 'asc' },
            });
            const grouped = groupByIssueId(rows, (row) => row);
            return issueIds.map((id) => grouped.get(id) ?? []);
        }),
        issueComments: new dataloader_1.default(async (issueIds) => {
            const rows = await prisma.comment.findMany({
                where: { issueId: { in: [...issueIds] } },
                orderBy: { createdAt: 'asc' },
                include: { author: { select: USER_FIELDS } },
            });
            const grouped = groupByIssueId(rows, (row) => row);
            return issueIds.map((id) => grouped.get(id) ?? []);
        }),
        messageReactions: new dataloader_1.default(async (messageIds) => {
            const rows = await prisma.messageReaction.findMany({
                where: { messageId: { in: [...messageIds] } },
                orderBy: { createdAt: 'asc' },
                select: { messageId: true, userId: true, emoji: true },
            });
            const grouped = groupReactionsByEmoji(rows, currentUserId);
            return messageIds.map((id) => [...(grouped.get(id)?.values() ?? [])]);
        }),
        messageAttachments: new dataloader_1.default(async (messageIds) => {
            const rows = await prisma.messageAttachment.findMany({
                where: { messageId: { in: [...messageIds] } },
                include: { attachment: true },
                orderBy: { attachment: { createdAt: 'asc' } },
            });
            const grouped = new Map();
            for (const row of rows) {
                const bucket = grouped.get(row.messageId) ?? [];
                bucket.push(row.attachment);
                grouped.set(row.messageId, bucket);
            }
            return messageIds.map((id) => grouped.get(id) ?? []);
        }),
        messageById: new dataloader_1.default(async (messageIds) => {
            const rows = await prisma.message.findMany({
                where: { id: { in: [...messageIds] } },
                include: { author: { select: USER_FIELDS } },
            });
            const byId = new Map();
            for (const row of rows)
                byId.set(row.id, row);
            return messageIds.map((id) => byId.get(id) ?? null);
        }),
    };
}
//# sourceMappingURL=loaders.js.map