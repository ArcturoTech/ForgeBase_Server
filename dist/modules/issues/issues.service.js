"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssuesService = exports.ISSUE_EVENTS = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../../common/graphql/enums");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const prisma_client_1 = require("../../prisma/prisma-client");
const prisma_service_1 = require("../../prisma/prisma.service");
const pubsub_module_1 = require("../../common/pubsub/pubsub.module");
const tenancy_service_1 = require("../../common/tenancy/tenancy.service");
const activity_service_1 = require("../activity/activity.service");
const notifications_service_1 = require("../notifications/notifications.service");
exports.ISSUE_EVENTS = {
    moved: 'issueMoved',
    created: 'issueCreated',
    updated: 'issueUpdated',
    commented: 'issueCommented',
};
const ISSUE_LIST_LIMIT = 500;
let IssuesService = class IssuesService {
    prisma;
    tenancy;
    activity;
    notifications;
    pubSub;
    constructor(prisma, tenancy, activity, notifications, pubSub) {
        this.prisma = prisma;
        this.tenancy = tenancy;
        this.activity = activity;
        this.notifications = notifications;
        this.pubSub = pubSub;
    }
    async loadIssueOrThrow(id) {
        const issue = await this.prisma.issue.findUnique({ where: { id } });
        if (!issue)
            throw new common_1.NotFoundException('Issue não encontrada');
        return issue;
    }
    async assertValidParent(parentId, orgId, selfId) {
        if (selfId && parentId === selfId) {
            throw new common_1.BadRequestException('Uma issue não pode ser pai de si mesma');
        }
        const parent = await this.prisma.issue.findUnique({ where: { id: parentId } });
        if (!parent)
            throw new common_1.NotFoundException('Issue pai não encontrada');
        if (parent.orgId !== orgId) {
            throw new common_1.BadRequestException('Issue pai pertence a outra organização');
        }
        if (parent.type !== enums_1.IssueType.EPIC) {
            throw new common_1.BadRequestException('Issue pai precisa ser do tipo EPIC');
        }
    }
    async listIssuesByBoard(userId, boardId) {
        await this.tenancy.assertBoardAccess(userId, boardId);
        return this.prisma.issue.findMany({
            where: { boardId },
            orderBy: [{ columnId: 'asc' }, { position: 'asc' }],
            take: ISSUE_LIST_LIMIT,
        });
    }
    async findIssueById(userId, id) {
        const issue = await this.loadIssueOrThrow(id);
        await this.tenancy.assertOrgMembership(userId, issue.orgId);
        return issue;
    }
    async createIssue(userId, input) {
        await this.tenancy.assertOrgMembership(userId, input.orgId);
        if (input.parentId) {
            await this.assertValidParent(input.parentId, input.orgId);
        }
        const buildIssueData = (key) => ({
            orgId: input.orgId,
            boardId: input.boardId,
            columnId: input.columnId,
            sprintId: input.sprintId,
            standalone: input.standalone ?? false,
            key,
            title: input.title,
            description: input.description,
            points: input.points,
            type: input.type,
            priority: input.priority,
            parentId: input.parentId,
            startDate: input.startDate,
            dueDate: input.dueDate,
            goal: input.goal,
            assignees: input.assigneeIds
                ? { create: input.assigneeIds.map((assigneeId) => ({ userId: assigneeId })) }
                : undefined,
            labels: input.labelIds
                ? { create: input.labelIds.map((labelId) => ({ labelId })) }
                : undefined,
        });
        const issue = await this.createIssueWithSequentialKey(input.orgId, buildIssueData);
        await this.pubSub.publish(exports.ISSUE_EVENTS.created, {
            [exports.ISSUE_EVENTS.created]: issue,
            boardId: issue.boardId,
        });
        await this.activity.recordActivity({
            orgId: issue.orgId,
            userId,
            action: 'created',
            targetType: 'issue',
            targetId: issue.key,
        });
        return issue;
    }
    async createBacklogIssueFromIntake(params) {
        const issue = await this.createIssueWithSequentialKey(params.orgId, (key) => ({
            orgId: params.orgId,
            boardId: params.boardId,
            columnId: params.columnId,
            key,
            title: params.title,
            description: params.description ?? undefined,
            type: params.type,
            priority: params.priority,
        }));
        await this.pubSub.publish(exports.ISSUE_EVENTS.created, {
            [exports.ISSUE_EVENTS.created]: issue,
            boardId: issue.boardId,
        });
        return issue;
    }
    isDuplicateKeyError(error) {
        return error instanceof prisma_client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
    }
    async createIssueWithSequentialKey(orgId, buildData) {
        for (let attempt = 0; attempt < 5; attempt += 1) {
            const count = await this.prisma.issue.count({ where: { orgId } });
            try {
                return await this.prisma.issue.create({ data: buildData(`KAN-${count + 1 + attempt}`) });
            }
            catch (error) {
                if (this.isDuplicateKeyError(error) && attempt < 4)
                    continue;
                throw error;
            }
        }
        throw new common_1.BadRequestException('Não foi possível gerar a chave da issue');
    }
    async updateIssue(userId, input) {
        const current = await this.loadIssueOrThrow(input.id);
        await this.tenancy.assertOrgMembership(userId, current.orgId);
        if (input.parentId) {
            await this.assertValidParent(input.parentId, current.orgId, current.id);
        }
        const { id, ...data } = input;
        const issue = await this.prisma.issue.update({ where: { id }, data });
        await this.pubSub.publish(exports.ISSUE_EVENTS.updated, {
            [exports.ISSUE_EVENTS.updated]: issue,
            boardId: issue.boardId,
        });
        return issue;
    }
    async moveIssue(userId, input) {
        const current = await this.loadIssueOrThrow(input.id);
        await this.tenancy.assertOrgMembership(userId, current.orgId);
        const targetColumn = await this.prisma.column.findUnique({
            where: { id: input.toColumnId },
            select: { boardId: true, isDone: true },
        });
        if (!targetColumn || targetColumn.boardId !== current.boardId) {
            throw new common_1.BadRequestException('Coluna inválida para esta issue');
        }
        const issue = await this.prisma.$transaction(async (tx) => {
            const destinationIssues = await tx.issue.findMany({
                where: { columnId: input.toColumnId, id: { not: input.id } },
                orderBy: { position: 'asc' },
                select: { id: true },
            });
            const targetIndex = Math.max(0, Math.min(input.position, destinationIssues.length));
            const orderedIds = destinationIssues.map((row) => row.id);
            orderedIds.splice(targetIndex, 0, input.id);
            for (let position = 0; position < orderedIds.length; position++) {
                await tx.issue.update({
                    where: { id: orderedIds[position] },
                    data: orderedIds[position] === input.id
                        ? { columnId: input.toColumnId, position, done: targetColumn.isDone }
                        : { position },
                });
            }
            if (current.columnId !== input.toColumnId) {
                const sourceIssues = await tx.issue.findMany({
                    where: { columnId: current.columnId },
                    orderBy: { position: 'asc' },
                    select: { id: true },
                });
                for (let position = 0; position < sourceIssues.length; position++) {
                    await tx.issue.update({ where: { id: sourceIssues[position].id }, data: { position } });
                }
            }
            return tx.issue.findUniqueOrThrow({ where: { id: input.id } });
        });
        if (issue.standalone && targetColumn.isDone) {
            await this.pubSub.publish(exports.ISSUE_EVENTS.moved, {
                [exports.ISSUE_EVENTS.moved]: issue,
                boardId: issue.boardId,
            });
            await this.prisma.issue.delete({ where: { id: issue.id } });
            return { ...issue, _deleted: true };
        }
        await this.pubSub.publish(exports.ISSUE_EVENTS.moved, {
            [exports.ISSUE_EVENTS.moved]: issue,
            boardId: issue.boardId,
        });
        await this.activity.recordActivity({
            orgId: issue.orgId,
            userId,
            action: 'moved',
            targetType: 'issue',
            targetId: issue.key,
        });
        return issue;
    }
    listIssuesBySprint(sprintId) {
        return this.prisma.issue.findMany({ where: { sprintId }, orderBy: { key: 'asc' } });
    }
    listIssuesByParent(parentId) {
        return this.prisma.issue.findMany({
            where: { parentId },
            orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
        });
    }
    async listEpicsByProject(userId, projectId) {
        await this.tenancy.assertProjectAccess(userId, projectId);
        return this.prisma.issue.findMany({
            where: { type: enums_1.IssueType.EPIC, board: { projectId } },
            orderBy: [{ startDate: 'asc' }, { createdAt: 'asc' }],
        });
    }
    async listIssuesByEpic(userId, epicId) {
        const epic = await this.loadIssueOrThrow(epicId);
        await this.tenancy.assertBoardAccess(userId, epic.boardId);
        return this.prisma.issue.findMany({
            where: { parentId: epicId },
            orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
        });
    }
    listIssuesAssignedToUser(userId) {
        return this.prisma.issue.findMany({
            where: { assignees: { some: { userId } }, done: false },
            orderBy: { updatedAt: 'desc' },
            take: 8,
        });
    }
    findColumnByIssue(columnId) {
        return this.prisma.column.findUnique({ where: { id: columnId } });
    }
    async listBacklogIssuesByProject(userId, projectId) {
        await this.tenancy.assertProjectAccess(userId, projectId);
        return this.prisma.issue.findMany({
            where: { sprintId: null, board: { projectId } },
            orderBy: { key: 'asc' },
            take: ISSUE_LIST_LIMIT,
        });
    }
    async assignIssueToSprint(userId, input) {
        const issue = await this.loadIssueOrThrow(input.issueId);
        await this.tenancy.assertOrgMembership(userId, issue.orgId);
        const updated = await this.prisma.issue.update({
            where: { id: input.issueId },
            data: { sprintId: input.sprintId ?? null },
        });
        await this.pubSub.publish(exports.ISSUE_EVENTS.updated, {
            [exports.ISSUE_EVENTS.updated]: updated,
            boardId: updated.boardId,
        });
        return updated;
    }
    async assignUserToIssue(currentUserId, input) {
        const issue = await this.loadIssueOrThrow(input.issueId);
        await this.tenancy.assertBoardAccess(currentUserId, issue.boardId);
        const board = await this.prisma.board.findUniqueOrThrow({
            where: { id: issue.boardId },
            select: { projectId: true },
        });
        const projectMember = await this.prisma.projectMember.findUnique({
            where: { projectId_userId: { projectId: board.projectId, userId: input.userId } },
            select: { id: true },
        });
        if (!projectMember) {
            throw new common_1.ForbiddenException('Usuário não é membro do projeto');
        }
        await this.prisma.issueAssignee.upsert({
            where: { issueId_userId: { issueId: input.issueId, userId: input.userId } },
            create: { issueId: input.issueId, userId: input.userId },
            update: {},
        });
        await this.pubSub.publish(exports.ISSUE_EVENTS.updated, {
            [exports.ISSUE_EVENTS.updated]: issue,
            boardId: issue.boardId,
        });
        await this.activity.recordActivity({
            orgId: issue.orgId,
            userId: currentUserId,
            action: 'assigned',
            targetType: 'issue',
            targetId: issue.key,
        });
        if (input.userId !== currentUserId) {
            void this.notifications.createNotificationInternal({
                orgId: issue.orgId,
                userId: input.userId,
                type: 'ISSUE_ASSIGNED',
                title: `Você foi atribuído a ${issue.key}`,
                body: issue.title,
            });
        }
        return issue;
    }
    async unassignUserFromIssue(currentUserId, input) {
        const issue = await this.loadIssueOrThrow(input.issueId);
        await this.tenancy.assertBoardAccess(currentUserId, issue.boardId);
        await this.prisma.issueAssignee.deleteMany({
            where: { issueId: input.issueId, userId: input.userId },
        });
        await this.pubSub.publish(exports.ISSUE_EVENTS.updated, {
            [exports.ISSUE_EVENTS.updated]: issue,
            boardId: issue.boardId,
        });
        await this.activity.recordActivity({
            orgId: issue.orgId,
            userId: currentUserId,
            action: 'unassigned',
            targetType: 'issue',
            targetId: issue.key,
        });
        return issue;
    }
    async listActivityByIssue(userId, issueId) {
        const issue = await this.loadIssueOrThrow(issueId);
        await this.tenancy.assertBoardAccess(userId, issue.boardId);
        return this.activity.listActivityByIssueKey(userId, issue.orgId, issue.key);
    }
    async removeIssue(userId, id) {
        const issue = await this.loadIssueOrThrow(id);
        await this.tenancy.assertOrgMembership(userId, issue.orgId);
        await this.prisma.issue.delete({ where: { id } });
        return true;
    }
    async addSubtaskToIssue(userId, input) {
        const issue = await this.loadIssueOrThrow(input.issueId);
        await this.tenancy.assertOrgMembership(userId, issue.orgId);
        const count = await this.prisma.subtask.count({ where: { issueId: input.issueId } });
        return this.prisma.subtask.create({
            data: { issueId: input.issueId, label: input.label, position: count },
        });
    }
    async toggleSubtask(userId, subtaskId) {
        const subtask = await this.prisma.subtask.findUnique({ where: { id: subtaskId } });
        if (!subtask)
            throw new common_1.NotFoundException('Subtarefa não encontrada');
        const issue = await this.loadIssueOrThrow(subtask.issueId);
        await this.tenancy.assertOrgMembership(userId, issue.orgId);
        return this.prisma.subtask.update({
            where: { id: subtaskId },
            data: { done: !subtask.done },
        });
    }
    async addCommentToIssue(userId, input) {
        const issue = await this.loadIssueOrThrow(input.issueId);
        await this.tenancy.assertOrgMembership(userId, issue.orgId);
        const comment = await this.prisma.comment.create({
            data: { issueId: input.issueId, authorId: userId, body: input.body },
        });
        await this.pubSub.publish(exports.ISSUE_EVENTS.commented, {
            [exports.ISSUE_EVENTS.commented]: issue,
            boardId: issue.boardId,
        });
        await this.activity.recordActivity({
            orgId: issue.orgId,
            userId,
            action: 'commented',
            targetType: 'issue',
            targetId: issue.key,
        });
        return comment;
    }
};
exports.IssuesService = IssuesService;
exports.IssuesService = IssuesService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, common_1.Inject)(pubsub_module_1.PUB_SUB)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenancy_service_1.TenancyService,
        activity_service_1.ActivityService,
        notifications_service_1.NotificationsService,
        graphql_subscriptions_1.PubSub])
], IssuesService);
//# sourceMappingURL=issues.service.js.map