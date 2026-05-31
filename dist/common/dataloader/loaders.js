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
function groupByIssueId(rows, value) {
    const map = new Map();
    for (const row of rows) {
        const bucket = map.get(row.issueId) ?? [];
        bucket.push(value(row));
        map.set(row.issueId, bucket);
    }
    return map;
}
function createLoaders(prisma) {
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
    };
}
//# sourceMappingURL=loaders.js.map