"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const bcrypt = __importStar(require("bcryptjs"));
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
    async inviteMemberByEmail(userId, input) {
        await this.tenancy.assertOrgMembership(userId, input.orgId);
        const invitee = await this.findOrCreatePendingUser(input.email);
        const existing = await this.prisma.membership.findUnique({
            where: { orgId_userId: { orgId: input.orgId, userId: invitee.id } },
        });
        if (existing)
            throw new common_1.ConflictException('Usuário já é membro');
        return this.prisma.membership.create({
            data: {
                orgId: input.orgId,
                userId: invitee.id,
                role: input.role,
                title: input.title,
            },
        });
    }
    async findOrCreatePendingUser(email) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing)
            return existing;
        const password = await bcrypt.hash((0, crypto_1.randomBytes)(32).toString('hex'), 10);
        const name = email.split('@')[0];
        return this.prisma.user.create({
            data: { name, email, password, emailVerified: false },
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