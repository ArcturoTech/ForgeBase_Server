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
exports.Document = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_type_json_1 = require("graphql-type-json");
const enums_1 = require("../../../common/graphql/enums");
const document_comment_model_1 = require("./document-comment.model");
let Document = class Document {
    id;
    orgId;
    projectId;
    parentId;
    title;
    authorId;
    version;
    status;
    category;
    body;
    isPrivate;
    isFolder;
    createdAt;
    updatedAt;
    comments;
};
exports.Document = Document;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Document.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Document.prototype, "orgId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "projectId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "parentId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Document.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "authorId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Document.prototype, "version", void 0);
__decorate([
    (0, graphql_1.Field)(() => enums_1.DocStatus),
    __metadata("design:type", String)
], Document.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => enums_1.DocCategory),
    __metadata("design:type", String)
], Document.prototype, "category", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_type_json_1.GraphQLJSON, { nullable: true }),
    __metadata("design:type", Object)
], Document.prototype, "body", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], Document.prototype, "isPrivate", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], Document.prototype, "isFolder", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Document.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Document.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [document_comment_model_1.DocumentComment]),
    __metadata("design:type", Array)
], Document.prototype, "comments", void 0);
exports.Document = Document = __decorate([
    (0, graphql_1.ObjectType)()
], Document);
//# sourceMappingURL=document.model.js.map