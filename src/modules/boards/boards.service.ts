import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { CreateColumnInput } from './dto/create-column.input';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';

@Injectable()
export class BoardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

  async createBoard(userId: string, input: CreateBoardInput) {
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

  async updateBoard(userId: string, input: UpdateBoardInput) {
    await this.tenancy.assertBoardAccess(userId, input.id);
    return this.prisma.board.update({
      where: { id: input.id },
      data: { name: input.name },
    });
  }

  async removeBoard(userId: string, id: string) {
    await this.tenancy.assertBoardAccess(userId, id);
    await this.prisma.board.delete({ where: { id } });
    return true;
  }

  async listBoardsByProject(userId: string, projectId: string) {
    await this.tenancy.assertProjectAccess(userId, projectId);
    return this.prisma.board.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findBoardById(userId: string, id: string) {
    await this.tenancy.assertBoardAccess(userId, id);
    const board = await this.prisma.board.findUnique({
      where: { id },
      include: { columns: { orderBy: { position: 'asc' } } },
    });
    if (!board) throw new NotFoundException('Board não encontrado');
    return board;
  }

  listColumnsByBoard(boardId: string) {
    return this.prisma.column.findMany({
      where: { boardId },
      orderBy: { position: 'asc' },
    });
  }

  async createColumn(userId: string, input: CreateColumnInput) {
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

  async removeColumn(userId: string, id: string) {
    const column = await this.prisma.column.findUnique({
      where: { id },
      select: { boardId: true },
    });
    if (!column) throw new NotFoundException('Coluna não encontrada');
    await this.tenancy.assertBoardAccess(userId, column.boardId);
    await this.prisma.column.delete({ where: { id } });
    return true;
  }
}
