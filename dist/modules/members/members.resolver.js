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
exports.MembersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const members_service_1 = require("./members.service");
const member_model_1 = require("./models/member.model");
const user_model_1 = require("../../users/models/user.model");
const enums_1 = require("../../common/graphql/enums");
const gql_auth_guard_1 = require("../../common/guards/gql-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const invite_member_by_email_input_1 = require("./dto/invite-member-by-email.input");
let MembersResolver = class MembersResolver {
    membersService;
    constructor(membersService) {
        this.membersService = membersService;
    }
    listMembers(user, orgId) {
        return this.membersService.listMembers(user.id, orgId);
    }
    inviteMember(user, orgId, userId, role, title) {
        return this.membersService.inviteMember(user.id, orgId, userId, role, title);
    }
    inviteMemberByEmail(user, input) {
        return this.membersService.inviteMemberByEmail(user.id, input);
    }
    updateMemberRole(user, membershipId, role) {
        return this.membersService.updateMemberRole(user.id, membershipId, role);
    }
    removeMember(user, membershipId) {
        return this.membersService.removeMember(user.id, membershipId);
    }
    user(member) {
        return this.membersService.findUserByMember(member.userId);
    }
};
exports.MembersResolver = MembersResolver;
__decorate([
    (0, graphql_1.Query)(() => [member_model_1.Member]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MembersResolver.prototype, "listMembers", null);
__decorate([
    (0, graphql_1.Mutation)(() => member_model_1.Member),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('userId', { type: () => graphql_1.ID })),
    __param(3, (0, graphql_1.Args)('role', { type: () => enums_1.MemberRole, nullable: true })),
    __param(4, (0, graphql_1.Args)('title', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MembersResolver.prototype, "inviteMember", null);
__decorate([
    (0, graphql_1.Mutation)(() => member_model_1.Member),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, invite_member_by_email_input_1.InviteMemberByEmailInput]),
    __metadata("design:returntype", Promise)
], MembersResolver.prototype, "inviteMemberByEmail", null);
__decorate([
    (0, graphql_1.Mutation)(() => member_model_1.Member),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('membershipId', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('role', { type: () => enums_1.MemberRole })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MembersResolver.prototype, "updateMemberRole", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('membershipId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MembersResolver.prototype, "removeMember", null);
__decorate([
    (0, graphql_1.ResolveField)(() => user_model_1.User),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [member_model_1.Member]),
    __metadata("design:returntype", Promise)
], MembersResolver.prototype, "user", null);
exports.MembersResolver = MembersResolver = __decorate([
    (0, graphql_1.Resolver)(() => member_model_1.Member),
    __metadata("design:paramtypes", [members_service_1.MembersService])
], MembersResolver);
//# sourceMappingURL=members.resolver.js.map