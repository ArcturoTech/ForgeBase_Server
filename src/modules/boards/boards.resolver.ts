import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './models/board.model';
import { Column } from './models/column.model';
import { CreateColumnInput } from './dto/create-column.input';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver(() => Board)
export class BoardsResolver {
  constructor(private readonly boardsService: BoardsService) {}

  @Query(() => [Board])
  @UseGuards(GqlAuthGuard)
  listBoardsByProject(
    @CurrentUser() user: AuthenticatedUser,
    @Args('projectId', { type: () => ID }) projectId: string,
  ): Promise<Board[]> {
    return this.boardsService.listBoardsByProject(user.id, projectId) as Promise<Board[]>;
  }

  @Query(() => Board)
  @UseGuards(GqlAuthGuard)
  findBoardById(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Board> {
    return this.boardsService.findBoardById(user.id, id) as Promise<Board>;
  }

  @Mutation(() => Board)
  @UseGuards(GqlAuthGuard)
  createBoard(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateBoardInput,
  ): Promise<Board> {
    return this.boardsService.createBoard(user.id, input) as Promise<Board>;
  }

  @Mutation(() => Board)
  @UseGuards(GqlAuthGuard)
  updateBoard(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: UpdateBoardInput,
  ): Promise<Board> {
    return this.boardsService.updateBoard(user.id, input) as Promise<Board>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeBoard(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.boardsService.removeBoard(user.id, id);
  }

  @Mutation(() => Column)
  @UseGuards(GqlAuthGuard)
  createColumn(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateColumnInput,
  ): Promise<Column> {
    return this.boardsService.createColumn(user.id, input) as Promise<Column>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeColumn(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.boardsService.removeColumn(user.id, id);
  }

  @ResolveField(() => [Column])
  columns(@Parent() board: Board): Promise<Column[]> {
    if (board.columns) return Promise.resolve(board.columns);
    return this.boardsService.listColumnsByBoard(board.id) as Promise<Column[]>;
  }
}
