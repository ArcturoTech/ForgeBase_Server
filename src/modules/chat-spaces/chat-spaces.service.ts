import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatSpaceKind, ChatSpaceRole } from '@/common/graphql/enums';
import { Prisma } from '@/prisma/prisma-client';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { CreateChatSpaceInput } from './dto/create-chat-space.input';
import { UpdateChatSpaceInput } from './dto/update-chat-space.input';
import { InviteChatSpaceMemberInput } from './dto/invite-chat-space-member.input';

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

const GENERAL_SPACE_NAME = 'Geral';

@Injectable()
export class ChatSpacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

  async ensureGeneralSpace(orgId: string, userId: string) {
    const existing = await this.prisma.chatSpace.findFirst({
      where: { orgId, kind: ChatSpaceKind.GENERAL },
    });

    const generalSpace =
      existing ??
      (await this.prisma.chatSpace.create({
        data: { orgId, name: GENERAL_SPACE_NAME, kind: ChatSpaceKind.GENERAL },
      }));

    await this.prisma.chatSpaceMember.upsert({
      where: { spaceId_userId: { spaceId: generalSpace.id, userId } },
      create: { spaceId: generalSpace.id, userId, role: ChatSpaceRole.MEMBER },
      update: {},
    });

    await this.prisma.channel.updateMany({
      where: { orgId, spaceId: null },
      data: { spaceId: generalSpace.id },
    });

    return generalSpace;
  }

  async assertChatSpaceMembership(userId: string, spaceId: string) {
    const membership = await this.prisma.chatSpaceMember.findUnique({
      where: { spaceId_userId: { spaceId, userId } },
      select: { id: true },
    });
    if (!membership) throw new ForbiddenException('Acesso negado a este espaço');
  }

  async assertChatSpaceAdmin(userId: string, spaceId: string) {
    const membership = await this.prisma.chatSpaceMember.findUnique({
      where: { spaceId_userId: { spaceId, userId } },
      select: { role: true },
    });
    if (!membership) throw new ForbiddenException('Acesso negado a este espaço');
    if (membership.role !== ChatSpaceRole.ADMIN) {
      throw new ForbiddenException('Apenas administradores do espaço podem executar esta ação');
    }
  }

  async listChatSpacesForUser(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    await this.ensureGeneralSpace(orgId, userId);

    const spaces = await this.prisma.chatSpace.findMany({
      where: { orgId, members: { some: { userId } } },
      include: { _count: { select: { members: true } } },
      orderBy: [{ kind: 'asc' }, { createdAt: 'asc' }],
    });

    return spaces.map((space) => this.decorateChatSpace(space));
  }

  async findChatSpaceById(userId: string, id: string) {
    await this.assertChatSpaceMembership(userId, id);
    const space = await this.prisma.chatSpace.findUnique({
      where: { id },
      include: { _count: { select: { members: true } } },
    });
    if (!space) throw new NotFoundException('Espaço não encontrado');
    return this.decorateChatSpace(space);
  }

  async listChatSpaceMembers(userId: string, spaceId: string) {
    await this.assertChatSpaceMembership(userId, spaceId);
    return this.prisma.chatSpaceMember.findMany({
      where: { spaceId },
      include: { user: { select: USER_SELECT } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createChatSpace(userId: string, input: CreateChatSpaceInput) {
    await this.tenancy.assertOrgAdmin(userId, input.orgId);

    const memberIds = await this.resolveSpaceMemberIds(input.orgId, userId, input.memberIds);

    try {
      const space = await this.prisma.chatSpace.create({
        data: {
          orgId: input.orgId,
          name: input.name,
          description: input.description,
          kind: ChatSpaceKind.CUSTOM,
          createdById: userId,
          members: {
            create: memberIds.map((memberId) => ({
              userId: memberId,
              role: memberId === userId ? ChatSpaceRole.ADMIN : ChatSpaceRole.MEMBER,
            })),
          },
        },
        include: { _count: { select: { members: true } } },
      });

      return this.decorateChatSpace(space);
    } catch (error) {
      if (this.isDuplicateNameError(error)) {
        throw new ConflictException('Já existe um espaço com esse nome');
      }
      throw error;
    }
  }

  private async resolveSpaceMemberIds(
    orgId: string,
    creatorId: string,
    requestedIds?: string[],
  ): Promise<string[]> {
    const candidates = [...new Set([creatorId, ...(requestedIds ?? [])])];
    const memberships = await this.prisma.membership.findMany({
      where: { orgId, userId: { in: candidates } },
      select: { userId: true },
    });
    const allowed = new Set(memberships.map((membership) => membership.userId));
    allowed.add(creatorId);
    return candidates.filter((id) => allowed.has(id));
  }

  private isDuplicateNameError(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
  }

  private async assertSpaceOrgAdmin(userId: string, spaceId: string) {
    const space = await this.prisma.chatSpace.findUnique({
      where: { id: spaceId },
      select: { orgId: true },
    });
    if (!space) throw new NotFoundException('Espaço não encontrado');
    await this.tenancy.assertOrgAdmin(userId, space.orgId);
  }

  async updateChatSpace(userId: string, id: string, input: UpdateChatSpaceInput) {
    await this.assertSpaceOrgAdmin(userId, id);
    try {
      const space = await this.prisma.chatSpace.update({
        where: { id },
        data: { name: input.name, description: input.description },
        include: { _count: { select: { members: true } } },
      });
      return this.decorateChatSpace(space);
    } catch (error) {
      if (this.isDuplicateNameError(error)) {
        throw new ConflictException('Já existe um espaço com esse nome');
      }
      throw error;
    }
  }

  async removeChatSpace(userId: string, id: string) {
    await this.assertSpaceOrgAdmin(userId, id);
    const space = await this.prisma.chatSpace.findUnique({
      where: { id },
      select: { kind: true },
    });
    if (!space) throw new NotFoundException('Espaço não encontrado');
    if (space.kind === ChatSpaceKind.GENERAL) {
      throw new ForbiddenException('O espaço Geral não pode ser removido');
    }
    await this.prisma.chatSpace.delete({ where: { id } });
    return true;
  }

  async inviteChatSpaceMember(userId: string, input: InviteChatSpaceMemberInput) {
    await this.assertChatSpaceAdmin(userId, input.spaceId);
    const space = await this.prisma.chatSpace.findUnique({
      where: { id: input.spaceId },
      select: { orgId: true },
    });
    if (!space) throw new NotFoundException('Espaço não encontrado');
    await this.tenancy.assertOrgMembership(input.userId, space.orgId);

    return this.prisma.chatSpaceMember.upsert({
      where: { spaceId_userId: { spaceId: input.spaceId, userId: input.userId } },
      create: {
        spaceId: input.spaceId,
        userId: input.userId,
        role: input.role ?? ChatSpaceRole.MEMBER,
      },
      update: {},
      include: { user: { select: USER_SELECT } },
    });
  }

  async removeChatSpaceMember(userId: string, spaceId: string, targetUserId: string) {
    await this.assertChatSpaceAdmin(userId, spaceId);
    const space = await this.prisma.chatSpace.findUnique({
      where: { id: spaceId },
      select: { kind: true },
    });
    if (!space) throw new NotFoundException('Espaço não encontrado');
    if (space.kind === ChatSpaceKind.GENERAL) {
      throw new ForbiddenException('Membros não podem ser removidos do espaço Geral');
    }
    await this.prisma.chatSpaceMember.delete({
      where: { spaceId_userId: { spaceId, userId: targetUserId } },
    });
    return true;
  }

  async updateChatSpaceMemberRole(
    userId: string,
    spaceId: string,
    targetUserId: string,
    role: ChatSpaceRole,
  ) {
    await this.assertChatSpaceAdmin(userId, spaceId);
    return this.prisma.chatSpaceMember.update({
      where: { spaceId_userId: { spaceId, userId: targetUserId } },
      data: { role },
      include: { user: { select: USER_SELECT } },
    });
  }

  private decorateChatSpace(space: { _count: { members: number } }) {
    const { _count, ...rest } = space;
    return { ...rest, memberCount: _count.members };
  }
}
