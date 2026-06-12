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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SprintsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const tenancy_service_1 = require("../../common/tenancy/tenancy.service");
const enums_1 = require("../../common/graphql/enums");
const notifications_service_1 = require("../notifications/notifications.service");
let SprintsService = class SprintsService {
    prisma;
    tenancy;
    notifications;
    constructor(prisma, tenancy, notifications) {
        this.prisma = prisma;
        this.tenancy = tenancy;
        this.notifications = notifications;
    }
    async listSprintsByProject(userId, projectId) {
        await this.tenancy.assertProjectAccess(userId, projectId);
        return this.prisma.sprint.findMany({
            where: { projectId },
            orderBy: { number: 'desc' },
        });
    }
    async findActiveSprintSummary(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        const sprint = await this.prisma.sprint.findFirst({
            where: { status: enums_1.SprintStatus.ACTIVE, project: { orgId } },
            orderBy: { number: 'desc' },
        });
        if (!sprint)
            return null;
        const issues = await this.prisma.issue.findMany({
            where: { sprintId: sprint.id },
            include: {
                column: { select: { name: true } },
                assignees: { include: { user: { select: { name: true } } } },
            },
        });
        const pointsTotal = issues.reduce((total, issue) => total + (issue.points ?? 0), 0);
        const pointsDone = issues
            .filter((issue) => issue.done)
            .reduce((total, issue) => total + (issue.points ?? 0), 0);
        const inReview = issues.filter((issue) => issue.column.name === 'Review').length;
        const memberNames = new Set();
        for (const issue of issues) {
            for (const assignee of issue.assignees) {
                if (assignee.user.name)
                    memberNames.add(assignee.user.name);
            }
        }
        const dayInMs = 86400000;
        const daysRemaining = sprint.endDate
            ? Math.max(0, Math.ceil((sprint.endDate.getTime() - Date.now()) / dayInMs))
            : 0;
        const durationDays = sprint.startDate && sprint.endDate
            ? Math.max(1, Math.round((sprint.endDate.getTime() - sprint.startDate.getTime()) / dayInMs))
            : 0;
        return {
            id: sprint.id,
            number: sprint.number,
            name: sprint.name,
            pointsDone,
            pointsTotal,
            issueCount: issues.length,
            inReview,
            daysRemaining,
            durationDays,
            members: [...memberNames],
            startDate: sprint.startDate ?? undefined,
            endDate: sprint.endDate ?? undefined,
        };
    }
    async findSprintById(userId, id) {
        const sprint = await this.loadSprintOrThrow(id);
        await this.tenancy.assertProjectAccess(userId, sprint.projectId);
        return sprint;
    }
    async createSprint(userId, input) {
        await this.tenancy.assertProjectAccess(userId, input.projectId);
        return this.prisma.sprint.create({
            data: {
                projectId: input.projectId,
                number: input.number,
                name: input.name,
                code: input.code,
                targetPoints: input.targetPoints,
            },
        });
    }
    async updateSprint(userId, input) {
        const sprint = await this.loadSprintOrThrow(input.id);
        await this.tenancy.assertProjectAccess(userId, sprint.projectId);
        const { id, ...rest } = input;
        return this.prisma.sprint.update({
            where: { id },
            data: rest,
        });
    }
    async removeSprint(userId, id) {
        const sprint = await this.loadSprintOrThrow(id);
        await this.tenancy.assertProjectAccess(userId, sprint.projectId);
        await this.prisma.sprint.delete({ where: { id } });
        return true;
    }
    async startSprintById(userId, id) {
        const sprint = await this.loadSprintOrThrow(id);
        await this.tenancy.assertProjectAccess(userId, sprint.projectId);
        const updated = await this.prisma.sprint.update({
            where: { id },
            data: { status: enums_1.SprintStatus.ACTIVE },
        });
        void this.fanOutSprintNotification(sprint.projectId, 'SPRINT_STARTED', `Sprint "${sprint.name}" iniciada`);
        return updated;
    }
    async closeSprintById(userId, id) {
        const sprint = await this.loadSprintOrThrow(id);
        await this.tenancy.assertProjectAccess(userId, sprint.projectId);
        const updated = await this.prisma.sprint.update({
            where: { id },
            data: { status: enums_1.SprintStatus.CLOSED },
        });
        void this.fanOutSprintNotification(sprint.projectId, 'SPRINT_CLOSED', `Sprint "${sprint.name}" encerrada`);
        return updated;
    }
    async getSprintRemainingCount(userId, id) {
        const sprint = await this.loadSprintOrThrow(id);
        await this.tenancy.assertProjectAccess(userId, sprint.projectId);
        return this.prisma.issue.count({ where: { sprintId: id, done: false } });
    }
    async closeSprintWithOptions(userId, id, action) {
        const sprint = await this.loadSprintOrThrow(id);
        await this.tenancy.assertProjectAccess(userId, sprint.projectId);
        if (action === enums_1.CloseSprintAction.MOVE_TO_BACKLOG) {
            await this.prisma.issue.updateMany({
                where: { sprintId: id, done: false },
                data: { sprintId: null },
            });
        }
        else if (action === enums_1.CloseSprintAction.MARK_DONE) {
            await this.prisma.issue.updateMany({
                where: { sprintId: id, done: false },
                data: { done: true },
            });
        }
        const closedAs = action === enums_1.CloseSprintAction.CLOSE_INCOMPLETE
            ? enums_1.SprintClosureType.INCOMPLETE
            : enums_1.SprintClosureType.COMPLETE;
        const updated = await this.prisma.sprint.update({
            where: { id },
            data: { status: enums_1.SprintStatus.CLOSED, closedAs },
        });
        void this.fanOutSprintNotification(sprint.projectId, 'SPRINT_CLOSED', `Sprint "${sprint.name}" encerrada`);
        return updated;
    }
    async restartSprint(userId, id) {
        const sprint = await this.loadSprintOrThrow(id);
        await this.tenancy.assertProjectAccess(userId, sprint.projectId);
        if (sprint.status !== enums_1.SprintStatus.CLOSED) {
            throw new common_1.BadRequestException('Apenas sprints encerradas podem ser reiniciadas');
        }
        const lastSprint = await this.prisma.sprint.findFirst({
            where: { projectId: sprint.projectId },
            orderBy: { number: 'desc' },
            select: { number: true },
        });
        return this.prisma.sprint.create({
            data: {
                projectId: sprint.projectId,
                parentSprintId: id,
                number: (lastSprint?.number ?? sprint.number) + 1,
                name: `${sprint.name} (Reinício)`,
                targetPoints: sprint.targetPoints,
            },
        });
    }
    async fanOutSprintNotification(projectId, type, title) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: { orgId: true },
        });
        if (!project)
            return;
        const members = await this.prisma.projectMember.findMany({
            where: { projectId },
            select: { userId: true },
        });
        await Promise.all(members.map((m) => this.notifications.createNotificationInternal({
            orgId: project.orgId,
            userId: m.userId,
            type,
            title,
        })));
    }
    async loadSprintOrThrow(id) {
        const sprint = await this.prisma.sprint.findUnique({ where: { id } });
        if (!sprint)
            throw new common_1.NotFoundException('Sprint não encontrada');
        return sprint;
    }
};
exports.SprintsService = SprintsService;
exports.SprintsService = SprintsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenancy_service_1.TenancyService,
        notifications_service_1.NotificationsService])
], SprintsService);
//# sourceMappingURL=sprints.service.js.map