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
exports.DocumentCommentResolver = exports.DocumentsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const documents_service_1 = require("./documents.service");
const document_model_1 = require("./models/document.model");
const document_share_model_1 = require("./models/document-share.model");
const document_comment_model_1 = require("./models/document-comment.model");
const create_document_input_1 = require("./dto/create-document.input");
const update_document_input_1 = require("./dto/update-document.input");
const user_model_1 = require("../../users/models/user.model");
const gql_auth_guard_1 = require("../../common/guards/gql-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let DocumentsResolver = class DocumentsResolver {
    documentsService;
    constructor(documentsService) {
        this.documentsService = documentsService;
    }
    listDocuments(user, orgId) {
        return this.documentsService.listDocuments(user.id, orgId);
    }
    listDocumentsByProject(user, projectId) {
        return this.documentsService.listDocumentsByProject(user.id, projectId);
    }
    findProjectOverview(user, projectId) {
        return this.documentsService.findProjectOverviewDocument(user.id, projectId);
    }
    findDocumentById(user, id) {
        return this.documentsService.findDocumentById(user.id, id);
    }
    createDocument(user, input) {
        return this.documentsService.createDocument(user.id, input);
    }
    updateDocument(user, input) {
        return this.documentsService.updateDocument(user.id, input);
    }
    removeDocument(user, id) {
        return this.documentsService.removeDocument(user.id, id);
    }
    addCommentToDocument(user, documentId, body) {
        return this.documentsService.addCommentToDocument(user.id, documentId, body);
    }
    resolveDocumentComment(user, id, resolved) {
        return this.documentsService.resolveDocumentComment(user.id, id, resolved);
    }
    listPublicDocuments(user, orgId) {
        return this.documentsService.listPublicDocuments(user.id, orgId);
    }
    listMyDocuments(user, orgId) {
        return this.documentsService.listMyDocuments(user.id, orgId);
    }
    listDocumentsSharedWithMe(user, orgId) {
        return this.documentsService.listDocumentsSharedWithMe(user.id, orgId);
    }
    listRootDocuments(user, orgId) {
        return this.documentsService.listRootDocuments(user.id, orgId);
    }
    listDocumentChildren(user, orgId, parentId) {
        return this.documentsService.listDocumentChildren(user.id, orgId, parentId);
    }
    shareDocument(user, documentId, targetUserId) {
        return this.documentsService.shareDocument(user.id, documentId, targetUserId);
    }
    setDocumentPrivacy(user, documentId, isPrivate) {
        return this.documentsService.setDocumentPrivacy(user.id, documentId, isPrivate);
    }
    comments(document) {
        return this.documentsService.listCommentsByDocument(document.id);
    }
};
exports.DocumentsResolver = DocumentsResolver;
__decorate([
    (0, graphql_1.Query)(() => [document_model_1.Document]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "listDocuments", null);
__decorate([
    (0, graphql_1.Query)(() => [document_model_1.Document]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('projectId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "listDocumentsByProject", null);
__decorate([
    (0, graphql_1.Query)(() => document_model_1.Document, { nullable: true }),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('projectId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "findProjectOverview", null);
__decorate([
    (0, graphql_1.Query)(() => document_model_1.Document, { nullable: true }),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "findDocumentById", null);
__decorate([
    (0, graphql_1.Mutation)(() => document_model_1.Document),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_document_input_1.CreateDocumentInput]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "createDocument", null);
__decorate([
    (0, graphql_1.Mutation)(() => document_model_1.Document),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_document_input_1.UpdateDocumentInput]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "updateDocument", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "removeDocument", null);
__decorate([
    (0, graphql_1.Mutation)(() => document_comment_model_1.DocumentComment),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('documentId', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('body')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "addCommentToDocument", null);
__decorate([
    (0, graphql_1.Mutation)(() => document_comment_model_1.DocumentComment),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('resolved')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Boolean]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "resolveDocumentComment", null);
__decorate([
    (0, graphql_1.Query)(() => [document_model_1.Document]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "listPublicDocuments", null);
__decorate([
    (0, graphql_1.Query)(() => [document_model_1.Document]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "listMyDocuments", null);
__decorate([
    (0, graphql_1.Query)(() => [document_model_1.Document]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "listDocumentsSharedWithMe", null);
__decorate([
    (0, graphql_1.Query)(() => [document_model_1.Document]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "listRootDocuments", null);
__decorate([
    (0, graphql_1.Query)(() => [document_model_1.Document]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('parentId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "listDocumentChildren", null);
__decorate([
    (0, graphql_1.Mutation)(() => document_share_model_1.DocumentShare),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('documentId', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('targetUserId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "shareDocument", null);
__decorate([
    (0, graphql_1.Mutation)(() => document_model_1.Document),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('documentId', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('isPrivate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Boolean]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "setDocumentPrivacy", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [document_comment_model_1.DocumentComment]),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [document_model_1.Document]),
    __metadata("design:returntype", Promise)
], DocumentsResolver.prototype, "comments", null);
exports.DocumentsResolver = DocumentsResolver = __decorate([
    (0, graphql_1.Resolver)(() => document_model_1.Document),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService])
], DocumentsResolver);
let DocumentCommentResolver = class DocumentCommentResolver {
    documentsService;
    constructor(documentsService) {
        this.documentsService = documentsService;
    }
    author(comment) {
        return this.documentsService.findCommentAuthor(comment.authorId);
    }
};
exports.DocumentCommentResolver = DocumentCommentResolver;
__decorate([
    (0, graphql_1.ResolveField)(() => user_model_1.User),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [document_comment_model_1.DocumentComment]),
    __metadata("design:returntype", Promise)
], DocumentCommentResolver.prototype, "author", null);
exports.DocumentCommentResolver = DocumentCommentResolver = __decorate([
    (0, graphql_1.Resolver)(() => document_comment_model_1.DocumentComment),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService])
], DocumentCommentResolver);
//# sourceMappingURL=documents.resolver.js.map