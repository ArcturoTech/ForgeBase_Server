import { BoardsService } from './boards.service';
import { Board } from './models/board.model';
import { Column } from './models/column.model';
import { CreateColumnInput } from './dto/create-column.input';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
export declare class BoardsResolver {
    private readonly boardsService;
    constructor(boardsService: BoardsService);
    listBoardsByProject(user: AuthenticatedUser, projectId: string): Promise<Board[]>;
    findBoardById(user: AuthenticatedUser, id: string): Promise<Board>;
    createBoard(user: AuthenticatedUser, input: CreateBoardInput): Promise<Board>;
    updateBoard(user: AuthenticatedUser, input: UpdateBoardInput): Promise<Board>;
    removeBoard(user: AuthenticatedUser, id: string): Promise<boolean>;
    createColumn(user: AuthenticatedUser, input: CreateColumnInput): Promise<Column>;
    removeColumn(user: AuthenticatedUser, id: string): Promise<boolean>;
    columns(board: Board): Promise<Column[]>;
}
