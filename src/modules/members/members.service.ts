import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { MemberRole } from '@/common/graphql/enums';
import { InviteMemberByEmailInput } from './dto/invite-member-by-email.input';

const USER_FIELDS = {
  id: true,
  name: true,
  email: true,
  role: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class MembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

  async listMembers(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.membership.findMany({
      where: { orgId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findMembershipById(membershipId: string) {
    const membership = await this.prisma.membership.findUnique({ where: { id: membershipId } });
    if (!membership) throw new NotFoundException('Membro não encontrado');
    return membership;
  }

  async inviteMember(
    userId: string,
    orgId: string,
    memberUserId: string,
    role?: MemberRole,
    title?: string,
  ) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    const existing = await this.prisma.membership.findUnique({
      where: { orgId_userId: { orgId, userId: memberUserId } },
    });
    if (existing) throw new ConflictException('Usuário já é membro da organização');

    return this.prisma.membership.create({
      data: { orgId, userId: memberUserId, role, title },
    });
  }

  async inviteMemberByEmail(userId: string, input: InviteMemberByEmailInput) {
    await this.tenancy.assertOrgMembership(userId, input.orgId);

    const invitee = await this.findOrCreatePendingUser(input.email);

    const existing = await this.prisma.membership.findUnique({
      where: { orgId_userId: { orgId: input.orgId, userId: invitee.id } },
    });
    if (existing) throw new ConflictException('Usuário já é membro');

    return this.prisma.membership.create({
      data: {
        orgId: input.orgId,
        userId: invitee.id,
        role: input.role,
        title: input.title,
      },
    });
  }

  private async findOrCreatePendingUser(email: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) return existing;

    const password = await bcrypt.hash(randomBytes(32).toString('hex'), 10);
    const name = email.split('@')[0];

    return this.prisma.user.create({
      data: { name, email, password, emailVerified: false },
    });
  }

  async updateMemberRole(userId: string, membershipId: string, role: MemberRole) {
    const membership = await this.findMembershipById(membershipId);
    await this.tenancy.assertOrgMembership(userId, membership.orgId);
    return this.prisma.membership.update({
      where: { id: membershipId },
      data: { role },
    });
  }

  async removeMember(userId: string, membershipId: string) {
    const membership = await this.findMembershipById(membershipId);
    await this.tenancy.assertOrgMembership(userId, membership.orgId);
    await this.prisma.membership.delete({ where: { id: membershipId } });
    return true;
  }

  async findUserByMember(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: USER_FIELDS,
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }
}
