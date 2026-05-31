import { PrismaService } from "../../prisma/prisma.service";
import { TenancyService } from "../../common/tenancy/tenancy.service";
import { CreateColumnInput } from './dto/create-column.input';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';
export declare class BoardsService {
    private readonly prisma;
    private readonly tenancy;
    constructor(prisma: PrismaService, tenancy: TenancyService);
    createBoard(userId: string, input: CreateBoardInput): Promise<{
        columns: {
            id: string;
            name: string;
            position: number;
            wipLimit: number | null;
            color: string;
            boardId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        projectId: string;
    }>;
    updateBoard(userId: string, input: UpdateBoardInput): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        projectId: string;
    }>;
    removeBoard(userId: string, id: string): Promise<boolean>;
    listBoardsByProject(userId: string, projectId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        projectId: string;
    }[]>;
    findBoardById(userId: string, id: string): Promise<{
        columns: {
            id: string;
            name: string;
            position: number;
            wipLimit: number | null;
            color: string;
            boardId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        projectId: string;
    }>;
    listColumnsByBoard(boardId: string): import("generated/prisma").Prisma.PrismaPromise<{
        id: string;
        name: string;
        position: number;
        wipLimit: number | null;
        color: string;
        boardId: string;
    }[]>;
    createColumn(userId: string, input: CreateColumnInput): Promise<{
        id: string;
        name: string;
        position: number;
        wipLimit: number | null;
        color: string;
        boardId: string;
    }>;
    removeColumn(userId: string, id: string): Promise<boolean>;
}
