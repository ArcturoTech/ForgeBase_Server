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
exports.SnapshotsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../prisma/prisma.service");
const tenancy_service_1 = require("../../common/tenancy/tenancy.service");
const enums_1 = require("../../common/graphql/enums");
let SnapshotsService = class SnapshotsService {
    prisma;
    tenancy;
    constructor(prisma, tenancy) {
        this.prisma = prisma;
        this.tenancy = tenancy;
    }
    async captureActiveSprintSnapshots() {
        const sprints = await this.prisma.sprint.findMany({
            where: { status: enums_1.SprintStatus.ACTIVE },
            include: { issues: { select: { points: true, done: true } } },
        });
        for (const sprint of sprints) {
            const totalPoints = sprint.issues.reduce((total, issue) => total + (issue.points ?? 0), 0);
            const remainingPoints = sprint.issues
                .filter((issue) => !issue.done)
                .reduce((total, issue) => total + (issue.points ?? 0), 0);
            await this.prisma.sprintSnapshot.create({
                data: { sprintId: sprint.id, totalPoints, remainingPoints },
            });
        }
        return sprints.length;
    }
    async listSnapshotsBySprint(userId, sprintId) {
        const sprint = await this.prisma.sprint.findUnique({ where: { id: sprintId } });
        if (!sprint)
            throw new common_1.NotFoundException('Sprint não encontrada');
        await this.tenancy.assertProjectAccess(userId, sprint.projectId);
        return this.prisma.sprintSnapshot.findMany({
            where: { sprintId },
            orderBy: { capturedOn: 'asc' },
        });
    }
    async listVelocityByProject(userId, projectId) {
        await this.tenancy.assertProjectAccess(userId, projectId);
        const sprints = await this.prisma.sprint.findMany({
            where: { projectId },
            orderBy: { number: 'asc' },
            include: { issues: { select: { points: true, done: true } } },
        });
        return sprints.map((sprint) => ({
            sprintNumber: sprint.number,
            label: `S${sprint.number}`,
            planned: sprint.targetPoints ?? sprint.issues.reduce((total, issue) => total + (issue.points ?? 0), 0),
            done: sprint.issues.filter((issue) => issue.done).reduce((total, issue) => total + (issue.points ?? 0), 0),
        }));
    }
};
exports.SnapshotsService = SnapshotsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SnapshotsService.prototype, "captureActiveSprintSnapshots", null);
exports.SnapshotsService = SnapshotsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenancy_service_1.TenancyService])
], SnapshotsService);
//# sourceMappingURL=snapshots.service.js.map