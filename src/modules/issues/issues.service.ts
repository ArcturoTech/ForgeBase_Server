import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IssueType } from '@/common/graphql/enums';
import { PubSub } from 'graphql-subscriptions';
import { Prisma } from '@/prisma/prisma-client';
import { PrismaService } from '@/prisma/prisma.service';
import { PUB_SUB } from '@/common/pubsub/pubsub.module';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { ActivityService } from '@/modules/activity/activity.service';
import { CreateIssueInput } from './dto/create-issue.input';
import { UpdateIssueInput } from './dto/update-issue.input';
import { MoveIssueInput } from './dto/move-issue.input';
import { AddCommentToIssueInput, AddSubtaskInput } from './dto/issue-content.input';
import { AssignIssueToSprintInput } from './dto/assign-issue-to-sprint.input';
import { AssignUserToIssueInput } from './dto/assign-user-to-issue.input';

export const ISSUE_EVENTS = {
  moved: 'issueMoved',
  created: 'issueCreated',
  updated: 'issueUpdated',
  commented: 'issueCommented',
} as const;

const ISSUE_LIST_LIMIT = 500;

@Injectable()
export class IssuesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
    private readonly activity: ActivityService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  private async loadIssueOrThrow(id: string) {
    const issue = await this.prisma.issue.findUnique({ where: { id } });
    if (!issue) throw new NotFoundException('Issue não encontrada');
    return issue;
  }

  private async assertValidParent(parentId: string, orgId: string, selfId?: string) {
    if (selfId && parentId === selfId) {
      throw new BadRequestException('Uma issue não pode ser pai de si mesma');
    }
    const parent = await this.prisma.issue.findUnique({ where: { id: parentId } });
    if (!parent) throw new NotFoundException('Issue pai não encontrada');
    if (parent.orgId !== orgId) {
      throw new BadRequestException('Issue pai pertence a outra organização');
    }
    if (parent.type !== IssueType.EPIC) {
      throw new BadRequestException('Issue pai precisa ser do tipo EPIC');
    }
  }

  async listIssuesByBoard(userId: string, boardId: string) {
    await this.tenancy.assertBoardAccess(userId, boardId);
    return this.prisma.issue.findMany({
      where: { boardId },
      orderBy: [{ columnId: 'asc' }, { position: 'asc' }],
      take: ISSUE_LIST_LIMIT,
    });
  }

  async findIssueById(userId: string, id: string) {
    const issue = await this.loadIssueOrThrow(id);
    await this.tenancy.assertOrgMembership(userId, issue.orgId);
    return issue;
  }

  async createIssue(userId: string, input: CreateIssueInput) {
    await this.tenancy.assertOrgMembership(userId, input.orgId);
    if (input.parentId) {
      await this.assertValidParent(input.parentId, input.orgId);
    }
    const buildIssueData = (key: string) => ({
      orgId: input.orgId,
      boardId: input.boardId,
      columnId: input.columnId,
      sprintId: input.sprintId,
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
    await this.pubSub.publish(ISSUE_EVENTS.created, {
      [ISSUE_EVENTS.created]: issue,
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

  private isDuplicateKeyError(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
  }

  private async createIssueWithSequentialKey(
    orgId: string,
    buildData: (key: string) => Prisma.IssueUncheckedCreateInput,
  ) {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const count = await this.prisma.issue.count({ where: { orgId } });
      try {
        return await this.prisma.issue.create({ data: buildData(`KAN-${count + 1 + attempt}`) });
      } catch (error) {
        if (this.isDuplicateKeyError(error) && attempt < 4) continue;
        throw error;
      }
    }
    throw new BadRequestException('Não foi possível gerar a chave da issue');
  }

  async updateIssue(userId: string, input: UpdateIssueInput) {
    const current = await this.loadIssueOrThrow(input.id);
    await this.tenancy.assertOrgMembership(userId, current.orgId);
    if (input.parentId) {
      await this.assertValidParent(input.parentId, current.orgId, current.id);
    }
    const { id, ...data } = input;
    const issue = await this.prisma.issue.update({ where: { id }, data });
    await this.pubSub.publish(ISSUE_EVENTS.updated, {
      [ISSUE_EVENTS.updated]: issue,
      boardId: issue.boardId,
    });
    return issue;
  }

  async moveIssue(userId: string, input: MoveIssueInput) {
    const current = await this.loadIssueOrThrow(input.id);
    await this.tenancy.assertOrgMembership(userId, current.orgId);

    const targetColumn = await this.prisma.column.findUnique({
      where: { id: input.toColumnId },
      select: { boardId: true, isDone: true },
    });
    if (!targetColumn || targetColumn.boardId !== current.boardId) {
      throw new BadRequestException('Coluna inválida para esta issue');
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
          data:
            orderedIds[position] === input.id
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

    await this.pubSub.publish(ISSUE_EVENTS.moved, {
      [ISSUE_EVENTS.moved]: issue,
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

  listIssuesBySprint(sprintId: string) {
    return this.prisma.issue.findMany({ where: { sprintId }, orderBy: { key: 'asc' } });
  }

  listIssuesByParent(parentId: string) {
    return this.prisma.issue.findMany({
      where: { parentId },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async listEpicsByProject(userId: string, projectId: string) {
    await this.tenancy.assertProjectAccess(userId, projectId);
    return this.prisma.issue.findMany({
      where: { type: IssueType.EPIC, board: { projectId } },
      orderBy: [{ startDate: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async listIssuesByEpic(userId: string, epicId: string) {
    const epic = await this.loadIssueOrThrow(epicId);
    await this.tenancy.assertBoardAccess(userId, epic.boardId);
    return this.prisma.issue.findMany({
      where: { parentId: epicId },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });
  }

  listIssuesAssignedToUser(userId: string) {
    return this.prisma.issue.findMany({
      where: { assignees: { some: { userId } }, done: false },
      orderBy: { updatedAt: 'desc' },
      take: 8,
    });
  }

  findColumnByIssue(columnId: string) {
    return this.prisma.column.findUnique({ where: { id: columnId } });
  }

  async listBacklogIssuesByProject(userId: string, projectId: string) {
    await this.tenancy.assertProjectAccess(userId, projectId);
    return this.prisma.issue.findMany({
      where: { sprintId: null, board: { projectId } },
      orderBy: { key: 'asc' },
      take: ISSUE_LIST_LIMIT,
    });
  }

  async assignIssueToSprint(userId: string, input: AssignIssueToSprintInput) {
    const issue = await this.loadIssueOrThrow(input.issueId);
    await this.tenancy.assertOrgMembership(userId, issue.orgId);
    const updated = await this.prisma.issue.update({
      where: { id: input.issueId },
      data: { sprintId: input.sprintId ?? null },
    });
    await this.pubSub.publish(ISSUE_EVENTS.updated, {
      [ISSUE_EVENTS.updated]: updated,
      boardId: updated.boardId,
    });
    return updated;
  }

  async assignUserToIssue(currentUserId: string, input: AssignUserToIssueInput) {
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
      throw new ForbiddenException('Usuário não é membro do projeto');
    }
    await this.prisma.issueAssignee.upsert({
      where: { issueId_userId: { issueId: input.issueId, userId: input.userId } },
      create: { issueId: input.issueId, userId: input.userId },
      update: {},
    });
    await this.pubSub.publish(ISSUE_EVENTS.updated, {
      [ISSUE_EVENTS.updated]: issue,
      boardId: issue.boardId,
    });
    await this.activity.recordActivity({
      orgId: issue.orgId,
      userId: currentUserId,
      action: 'assigned',
      targetType: 'issue',
      targetId: issue.key,
    });
    return issue;
  }

  async unassignUserFromIssue(currentUserId: string, input: AssignUserToIssueInput) {
    const issue = await this.loadIssueOrThrow(input.issueId);
    await this.tenancy.assertBoardAccess(currentUserId, issue.boardId);
    await this.prisma.issueAssignee.deleteMany({
      where: { issueId: input.issueId, userId: input.userId },
    });
    await this.pubSub.publish(ISSUE_EVENTS.updated, {
      [ISSUE_EVENTS.updated]: issue,
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

  async listActivityByIssue(userId: string, issueId: string) {
    const issue = await this.loadIssueOrThrow(issueId);
    await this.tenancy.assertBoardAccess(userId, issue.boardId);
    return this.activity.listActivityByIssueKey(userId, issue.orgId, issue.key);
  }

  async removeIssue(userId: string, id: string) {
    const issue = await this.loadIssueOrThrow(id);
    await this.tenancy.assertOrgMembership(userId, issue.orgId);
    await this.prisma.issue.delete({ where: { id } });
    return true;
  }

  async addSubtaskToIssue(userId: string, input: AddSubtaskInput) {
    const issue = await this.loadIssueOrThrow(input.issueId);
    await this.tenancy.assertOrgMembership(userId, issue.orgId);
    const count = await this.prisma.subtask.count({ where: { issueId: input.issueId } });
    return this.prisma.subtask.create({
      data: { issueId: input.issueId, label: input.label, position: count },
    });
  }

  async toggleSubtask(userId: string, subtaskId: string) {
    const subtask = await this.prisma.subtask.findUnique({ where: { id: subtaskId } });
    if (!subtask) throw new NotFoundException('Subtarefa não encontrada');
    const issue = await this.loadIssueOrThrow(subtask.issueId);
    await this.tenancy.assertOrgMembership(userId, issue.orgId);
    return this.prisma.subtask.update({
      where: { id: subtaskId },
      data: { done: !subtask.done },
    });
  }

  async addCommentToIssue(userId: string, input: AddCommentToIssueInput) {
    const issue = await this.loadIssueOrThrow(input.issueId);
    await this.tenancy.assertOrgMembership(userId, issue.orgId);
    const comment = await this.prisma.comment.create({
      data: { issueId: input.issueId, authorId: userId, body: input.body },
    });
    await this.pubSub.publish(ISSUE_EVENTS.commented, {
      [ISSUE_EVENTS.commented]: issue,
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
}
