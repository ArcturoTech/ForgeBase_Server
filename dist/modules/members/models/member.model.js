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
exports.Member = void 0;
const graphql_1 = require("@nestjs/graphql");
const enums_1 = require("../../../common/graphql/enums");
const user_model_1 = require("../../../users/models/user.model");
let Member = class Member {
    id;
    orgId;
    userId;
    role;
    title;
    createdAt;
    user;
};
exports.Member = Member;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Member.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Member.prototype, "orgId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Member.prototype, "userId", void 0);
__decorate([
    (0, graphql_1.Field)(() => enums_1.MemberRole),
    __metadata("design:type", String)
], Member.prototype, "role", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Member.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], Member.prototype, "user", void 0);
exports.Member = Member = __decorate([
    (0, graphql_1.ObjectType)()
], Member);
//# sourceMappingURL=member.model.js.map