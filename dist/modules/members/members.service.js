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
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const tenancy_service_1 = require("../../common/tenancy/tenancy.service");
const USER_FIELDS = {
    id: true,
    name: true,
    email: true,
    role: true,
    emailVerified: true,
    createdAt: true,
    updatedAt: true,
};
let MembersService = class MembersService {
    prisma;
    tenancy;
    constructor(prisma, tenancy) {
        this.prisma = prisma;
        this.tenancy = tenancy;
    }
    async listMembers(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        return this.prisma.membership.findMany({
            where: { orgId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findMembershipById(membershipId) {
        const membership = await this.prisma.membership.findUnique({ where: { id: membershipId } });
        if (!membership)
            throw new common_1.NotFoundException('Membro não encontrado');
        return membership;
    }
    async inviteMember(userId, orgId, memberUserId, role, title) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        const existing = await this.prisma.membership.findUnique({
            where: { orgId_userId: { orgId, userId: memberUserId } },
        });
        if (existing)
            throw new common_1.ConflictException('Usuário já é membro da organização');
        return this.prisma.membership.create({
            data: { orgId, userId: memberUserId, role, title },
        });
    }
    async updateMemberRole(userId, membershipId, role) {
        const membership = await this.findMembershipById(membershipId);
        await this.tenancy.assertOrgMembership(userId, membership.orgId);
        return this.prisma.membership.update({
            where: { id: membershipId },
            data: { role },
        });
    }
    async removeMember(userId, membershipId) {
        const membership = await this.findMembershipById(membershipId);
        await this.tenancy.assertOrgMembership(userId, membership.orgId);
        await this.prisma.membership.delete({ where: { id: membershipId } });
        return true;
    }
    async findUserByMember(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: USER_FIELDS,
        });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        return user;
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenancy_service_1.TenancyService])
], MembersService);
//# sourceMappingURL=members.service.js.map