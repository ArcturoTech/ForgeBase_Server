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
exports.BoardsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const boards_service_1 = require("./boards.service");
const board_model_1 = require("./models/board.model");
const column_model_1 = require("./models/column.model");
const create_column_input_1 = require("./dto/create-column.input");
const create_board_input_1 = require("./dto/create-board.input");
const update_board_input_1 = require("./dto/update-board.input");
const gql_auth_guard_1 = require("../../common/guards/gql-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let BoardsResolver = class BoardsResolver {
    boardsService;
    constructor(boardsService) {
        this.boardsService = boardsService;
    }
    listBoardsByProject(user, projectId) {
        return this.boardsService.listBoardsByProject(user.id, projectId);
    }
    findBoardById(user, id) {
        return this.boardsService.findBoardById(user.id, id);
    }
    createBoard(user, input) {
        return this.boardsService.createBoard(user.id, input);
    }
    updateBoard(user, input) {
        return this.boardsService.updateBoard(user.id, input);
    }
    removeBoard(user, id) {
        return this.boardsService.removeBoard(user.id, id);
    }
    createColumn(user, input) {
        return this.boardsService.createColumn(user.id, input);
    }
    removeColumn(user, id) {
        return this.boardsService.removeColumn(user.id, id);
    }
    columns(board) {
        if (board.columns)
            return Promise.resolve(board.columns);
        return this.boardsService.listColumnsByBoard(board.id);
    }
};
exports.BoardsResolver = BoardsResolver;
__decorate([
    (0, graphql_1.Query)(() => [board_model_1.Board]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('projectId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BoardsResolver.prototype, "listBoardsByProject", null);
__decorate([
    (0, graphql_1.Query)(() => board_model_1.Board),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BoardsResolver.prototype, "findBoardById", null);
__decorate([
    (0, graphql_1.Mutation)(() => board_model_1.Board),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_board_input_1.CreateBoardInput]),
    __metadata("design:returntype", Promise)
], BoardsResolver.prototype, "createBoard", null);
__decorate([
    (0, graphql_1.Mutation)(() => board_model_1.Board),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_board_input_1.UpdateBoardInput]),
    __metadata("design:returntype", Promise)
], BoardsResolver.prototype, "updateBoard", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BoardsResolver.prototype, "removeBoard", null);
__decorate([
    (0, graphql_1.Mutation)(() => column_model_1.Column),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_column_input_1.CreateColumnInput]),
    __metadata("design:returntype", Promise)
], BoardsResolver.prototype, "createColumn", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BoardsResolver.prototype, "removeColumn", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [column_model_1.Column]),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [board_model_1.Board]),
    __metadata("design:returntype", Promise)
], BoardsResolver.prototype, "columns", null);
exports.BoardsResolver = BoardsResolver = __decorate([
    (0, graphql_1.Resolver)(() => board_model_1.Board),
    __metadata("design:paramtypes", [boards_service_1.BoardsService])
], BoardsResolver);
//# sourceMappingURL=boards.resolver.js.map