import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { MailService } from '@/common/mail/mail.service';
import { MemberRole, InvitationStatus } from '@/common/graphql/enums';
import { InviteToOrganizationInput } from './dto/invite-to-organization.input';

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class InvitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  async listOrganizationInvitations(
    userId: string,
    orgId: string,
    status: InvitationStatus = InvitationStatus.PENDING,
  ) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.invitation.findMany({
      where: { orgId, status },
      orderBy: { createdAt: 'desc' },
    });
  }

  async inviteToOrganization(userId: string, input: InviteToOrganizationInput) {
    await this.tenancy.assertOrgMembership(userId, input.orgId);

    const role = input.role ?? MemberRole.MEMBER;
    if (role === MemberRole.OWNER) {
      throw new BadRequestException('Não é possível convidar alguém como OWNER');
    }

    const email = input.email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const membership = await this.prisma.membership.findUnique({
        where: { orgId_userId: { orgId: input.orgId, userId: existingUser.id } },
      });
      if (membership) {
        throw new ConflictException('Este e-mail já é membro da organização');
      }
    }

    const pending = await this.prisma.invitation.findFirst({
      where: { orgId: input.orgId, email, status: InvitationStatus.PENDING },
    });
    if (pending) {
      throw new ConflictException('Já existe um convite pendente para este e-mail');
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

    const invitation = await this.prisma.invitation.create({
      data: {
        orgId: input.orgId,
        email,
        role,
        token,
        invitedById: userId,
        expiresAt,
      },
    });

    await this.dispatchInviteEmail(invitation.id, token, email, role, input.orgId, userId);
    return invitation;
  }

  async acceptInvitation(userId: string, token: string) {
    const invitation = await this.prisma.invitation.findUnique({ where: { token } });
    if (!invitation) {
      throw new NotFoundException('Convite não encontrado');
    }
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Convite já utilizado ou cancelado');
    }
    if (invitation.expiresAt.getTime() < Date.now()) {
      await this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.EXPIRED },
      });
      throw new BadRequestException('Convite expirado');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user || user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      throw new ForbiddenException('Este convite é destinado a outro e-mail');
    }

    const alreadyMember = await this.prisma.membership.findUnique({
      where: { orgId_userId: { orgId: invitation.orgId, userId } },
    });
    if (!alreadyMember) {
      await this.prisma.membership.create({
        data: { orgId: invitation.orgId, userId, role: invitation.role },
      });
    }

    return this.prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.ACCEPTED, acceptedAt: new Date() },
    });
  }

  async revokeInvitation(userId: string, invitationId: string) {
    const invitation = await this.requireInvitation(invitationId);
    await this.tenancy.assertOrgMembership(userId, invitation.orgId);
    await this.prisma.invitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.REVOKED },
    });
    return true;
  }

  async resendInvitation(userId: string, invitationId: string) {
    const invitation = await this.requireInvitation(invitationId);
    await this.tenancy.assertOrgMembership(userId, invitation.orgId);
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Apenas convites pendentes podem ser reenviados');
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS);
    const updated = await this.prisma.invitation.update({
      where: { id: invitationId },
      data: { token, expiresAt },
    });

    await this.dispatchInviteEmail(
      updated.id,
      token,
      updated.email,
      updated.role,
      updated.orgId,
      userId,
    );
    return updated;
  }

  async invitationByToken(token: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
      include: { organization: { select: { name: true } } },
    });
    if (!invitation) {
      throw new NotFoundException('Convite não encontrado');
    }
    return { ...invitation, orgName: invitation.organization.name };
  }

  private async requireInvitation(invitationId: string) {
    const invitation = await this.prisma.invitation.findUnique({ where: { id: invitationId } });
    if (!invitation) {
      throw new NotFoundException('Convite não encontrado');
    }
    return invitation;
  }

  private async dispatchInviteEmail(
    _invitationId: string,
    token: string,
    email: string,
    role: MemberRole,
    orgId: string,
    inviterId: string,
  ): Promise<void> {
    const [org, inviter] = await Promise.all([
      this.prisma.organization.findUnique({ where: { id: orgId }, select: { name: true } }),
      this.prisma.user.findUnique({ where: { id: inviterId }, select: { name: true } }),
    ]);

    const frontendUrl = this.config.get<string>('app.frontendUrl') ?? 'http://localhost:3000';
    const acceptUrl = `${frontendUrl}/invite/accept?token=${token}`;

    await this.mail.sendOrganizationInvite({
      to: email,
      orgName: org?.name ?? 'sua organização',
      inviterName: inviter?.name ?? 'Um membro',
      acceptUrl,
      role,
    });
  }
}
