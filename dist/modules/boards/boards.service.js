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
exports.BoardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const tenancy_service_1 = require("../../common/tenancy/tenancy.service");
let BoardsService = class BoardsService {
    prisma;
    tenancy;
    constructor(prisma, tenancy) {
        this.prisma = prisma;
        this.tenancy = tenancy;
    }
    async createBoard(userId, input) {
        await this.tenancy.assertProjectAccess(userId, input.projectId);
        return this.prisma.board.create({
            data: {
                projectId: input.projectId,
                name: input.name,
                columns: {
                    create: [
                        { name: 'A fazer', position: 0 },
                        { name: 'Em progresso', position: 1 },
                        { name: 'Concluído', position: 2 },
                    ],
                },
            },
            include: { columns: { orderBy: { position: 'asc' } } },
        });
    }
    async updateBoard(userId, input) {
        await this.tenancy.assertBoardAccess(userId, input.id);
        return this.prisma.board.update({
            where: { id: input.id },
            data: { name: input.name },
        });
    }
    async removeBoard(userId, id) {
        await this.tenancy.assertBoardAccess(userId, id);
        await this.prisma.board.delete({ where: { id } });
        return true;
    }
    async listBoardsByProject(userId, projectId) {
        await this.tenancy.assertProjectAccess(userId, projectId);
        return this.prisma.board.findMany({
            where: { projectId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findBoardById(userId, id) {
        await this.tenancy.assertBoardAccess(userId, id);
        const board = await this.prisma.board.findUnique({
            where: { id },
            include: { columns: { orderBy: { position: 'asc' } } },
        });
        if (!board)
            throw new common_1.NotFoundException('Board não encontrado');
        return board;
    }
    listColumnsByBoard(boardId) {
        return this.prisma.column.findMany({
            where: { boardId },
            orderBy: { position: 'asc' },
        });
    }
    async createColumn(userId, input) {
        await this.tenancy.assertBoardAccess(userId, input.boardId);
        return this.prisma.column.create({
            data: {
                boardId: input.boardId,
                name: input.name,
                position: input.position,
                wipLimit: input.wipLimit,
                color: input.color ?? 'var(--fb-text-faint)',
            },
        });
    }
    async removeColumn(userId, id) {
        const column = await this.prisma.column.findUnique({
            where: { id },
            select: { boardId: true },
        });
        if (!column)
            throw new common_1.NotFoundException('Coluna não encontrada');
        await this.tenancy.assertBoardAccess(userId, column.boardId);
        await this.prisma.column.delete({ where: { id } });
        return true;
    }
};
exports.BoardsService = BoardsService;
exports.BoardsService = BoardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenancy_service_1.TenancyService])
], BoardsService);
//# sourceMappingURL=boards.service.js.map