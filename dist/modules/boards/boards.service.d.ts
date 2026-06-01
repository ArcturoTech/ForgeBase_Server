import { PrismaService } from "../../prisma/prisma.service";
import { TenancyService } from "../../common/tenancy/tenancy.service";
import { CreateColumnInput } from './dto/create-column.input';
import { UpdateColumnInput } from './dto/update-column.input';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';
export declare class BoardsService {
    private readonly prisma;
    private readonly tenancy;
    constructor(prisma: PrismaService, tenancy: TenancyService);
    createBoard(userId: string, input: CreateBoardInput): Promise<{
        columns: {
            name: string;
            id: string;
            position: number;
            color: string;
            boardId: string;
            wipLimit: number | null;
            isDone: boolean;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        projectId: string;
    }>;
    updateBoard(userId: string, input: UpdateBoardInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        projectId: string;
    }>;
    removeBoard(userId: string, id: string): Promise<boolean>;
    listBoardsByProject(userId: string, projectId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        projectId: string;
    }[]>;
    findBoardById(userId: string, id: string): Promise<{
        columns: {
            name: string;
            id: string;
            position: number;
            color: string;
            boardId: string;
            wipLimit: number | null;
            isDone: boolean;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        projectId: string;
    }>;
    listColumnsByBoard(boardId: string): import("generated/prisma").Prisma.PrismaPromise<{
        name: string;
        id: string;
        position: number;
        color: string;
        boardId: string;
        wipLimit: number | null;
        isDone: boolean;
    }[]>;
    createColumn(userId: string, input: CreateColumnInput): Promise<{
        name: string;
        id: string;
        position: number;
        color: string;
        boardId: string;
        wipLimit: number | null;
        isDone: boolean;
    }>;
    updateColumn(userId: string, input: UpdateColumnInput): Promise<{
        name: string;
        id: string;
        position: number;
        color: string;
        boardId: string;
        wipLimit: number | null;
        isDone: boolean;
    }>;
    removeColumn(userId: string, id: string): Promise<boolean>;
}
