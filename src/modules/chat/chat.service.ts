import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { ChannelMemberRole, ChannelType } from '@/common/graphql/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { PUB_SUB } from '@/common/pubsub/pubsub.module';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { CreateGroupChannelInput } from './dto/create-group-channel.input';
import { SendMessageInput } from './dto/send-message.input';

export const CHAT_EVENTS = {
  messageReceived: 'messageReceived',
} as const;

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

const GENERAL_CHANNEL_NAME = 'Geral';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async listMyChannels(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    await this.ensureGeneralMembership(userId, orgId);

    const channels = await this.prisma.channel.findMany({
      where: { orgId, members: { some: { userId } } },
      include: { members: { include: { user: { select: USER_SELECT } } } },
      orderBy: { updatedAt: 'desc' },
    });

    return Promise.all(channels.map((channel) => this.decorateChannel(channel, userId)));
  }

  async findChannelById(userId: string, id: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      include: { members: { include: { user: { select: USER_SELECT } } } },
    });
    if (!channel) throw new NotFoundException('Canal não encontrado');
    await this.assertChannelMembership(userId, id);
    return this.decorateChannel(channel, userId);
  }

  async listChannelMessages(userId: string, channelId: string, limit = 50, before?: string) {
    await this.assertChannelMembership(userId, channelId);
    const messages = await this.prisma.message.findMany({
      where: {
        channelId,
        deletedAt: null,
        ...(before ? { createdAt: { lt: new Date(before) } } : {}),
      },
      include: { author: { select: USER_SELECT } },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
    });
    return messages.reverse();
  }

  async createGroupChannel(userId: string, input: CreateGroupChannelInput) {
    await this.tenancy.assertOrgMembership(userId, input.orgId);
    const memberIds = await this.resolveOrgMemberIds(input.orgId, [
      userId,
      ...(input.memberIds ?? []),
    ]);

    const channel = await this.prisma.channel.create({
      data: {
        orgId: input.orgId,
        type: ChannelType.GROUP,
        name: input.name,
        description: input.description,
        createdById: userId,
        members: {
          create: memberIds.map((memberId) => ({
            userId: memberId,
            role: memberId === userId ? ChannelMemberRole.OWNER : ChannelMemberRole.MEMBER,
          })),
        },
      },
    });
    return this.findChannelById(userId, channel.id);
  }

  async openDirectChannel(userId: string, orgId: string, targetUserId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    await this.tenancy.assertOrgMembership(targetUserId, orgId);
    if (userId === targetUserId) {
      throw new ForbiddenException('Não é possível abrir conversa consigo mesmo');
    }

    const dmKey = [userId, targetUserId].sort().join(':');
    const existing = await this.prisma.channel.findUnique({
      where: { orgId_dmKey: { orgId, dmKey } },
    });
    if (existing) return this.findChannelById(userId, existing.id);

    const channel = await this.prisma.channel.create({
      data: {
        orgId,
        type: ChannelType.DIRECT,
        dmKey,
        createdById: userId,
        members: {
          create: [{ userId }, { userId: targetUserId }],
        },
      },
    });
    return this.findChannelById(userId, channel.id);
  }

  async sendMessage(userId: string, input: SendMessageInput) {
    await this.assertChannelMembership(userId, input.channelId);

    const message = await this.prisma.message.create({
      data: {
        channelId: input.channelId,
        authorId: userId,
        body: input.body,
        replyToId: input.replyToId,
      },
      include: { author: { select: USER_SELECT } },
    });

    await this.prisma.channel.update({
      where: { id: input.channelId },
      data: { updatedAt: new Date() },
    });

    await this.pubSub.publish(CHAT_EVENTS.messageReceived, {
      [CHAT_EVENTS.messageReceived]: message,
      channelId: message.channelId,
    });

    return message;
  }

  async editMessage(userId: string, id: string, body: string) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message || message.deletedAt) throw new NotFoundException('Mensagem não encontrada');
    if (message.authorId !== userId) {
      throw new ForbiddenException('Apenas o autor pode editar a mensagem');
    }
    return this.prisma.message.update({
      where: { id },
      data: { body, editedAt: new Date() },
      include: { author: { select: USER_SELECT } },
    });
  }

  async removeMessage(userId: string, id: string) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message || message.deletedAt) throw new NotFoundException('Mensagem não encontrada');
    if (message.authorId !== userId) {
      throw new ForbiddenException('Apenas o autor pode excluir a mensagem');
    }
    await this.prisma.message.update({
      where: { id },
      data: { deletedAt: new Date(), body: '' },
    });
    return true;
  }

  async markChannelRead(userId: string, channelId: string) {
    await this.assertChannelMembership(userId, channelId);
    await this.prisma.channelMember.update({
      where: { channelId_userId: { channelId, userId } },
      data: { lastReadAt: new Date() },
    });
    return true;
  }

  private async decorateChannel(
    channel: { id: string; members: { userId: string; lastReadAt: Date | null }[] },
    userId: string,
  ) {
    const membership = channel.members.find((member) => member.userId === userId);
    const lastReadAt = membership?.lastReadAt ?? null;

    const [lastMessage, unreadCount] = await Promise.all([
      this.prisma.message.findFirst({
        where: { channelId: channel.id, deletedAt: null },
        include: { author: { select: USER_SELECT } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.message.count({
        where: {
          channelId: channel.id,
          deletedAt: null,
          authorId: { not: userId },
          ...(lastReadAt ? { createdAt: { gt: lastReadAt } } : {}),
        },
      }),
    ]);

    return { ...channel, lastMessage, unreadCount };
  }

  private async assertChannelMembership(userId: string, channelId: string) {
    const membership = await this.prisma.channelMember.findUnique({
      where: { channelId_userId: { channelId, userId } },
      select: { id: true },
    });
    if (!membership) throw new ForbiddenException('Acesso negado a este canal');
  }

  private async resolveOrgMemberIds(orgId: string, candidateIds: string[]) {
    const uniqueIds = [...new Set(candidateIds)];
    const memberships = await this.prisma.membership.findMany({
      where: { orgId, userId: { in: uniqueIds } },
      select: { userId: true },
    });
    return memberships.map((membership) => membership.userId);
  }

  private async ensureGeneralMembership(userId: string, orgId: string) {
    const channel = await this.ensureGeneralChannel(orgId);
    await this.prisma.channelMember.upsert({
      where: { channelId_userId: { channelId: channel.id, userId } },
      create: { channelId: channel.id, userId },
      update: {},
    });
    return channel;
  }

  private async ensureGeneralChannel(orgId: string) {
    const existing = await this.prisma.channel.findFirst({
      where: { orgId, type: ChannelType.GENERAL },
    });
    if (existing) return existing;

    return this.prisma.channel.create({
      data: { orgId, type: ChannelType.GENERAL, name: GENERAL_CHANNEL_NAME },
    });
  }
}
