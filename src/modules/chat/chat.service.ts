import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { ChannelMemberRole, ChannelType } from '@/common/graphql/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { PUB_SUB } from '@/common/pubsub/pubsub.module';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { ChatSpacesService } from '@/modules/chat-spaces/chat-spaces.service';
import { CreateGroupChannelInput } from './dto/create-group-channel.input';
import { SendMessageInput } from './dto/send-message.input';
import { AddReactionInput } from './dto/add-reaction.input';
import { ReactionGroup } from './models/reaction-group.model';

export const CHAT_EVENTS = {
  messageReceived: 'messageReceived',
  messageEdited: 'messageEdited',
  messageDeleted: 'messageDeleted',
  reactionChanged: 'reactionChanged',
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
    @Inject(forwardRef(() => ChatSpacesService))
    private readonly chatSpaces: ChatSpacesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async listMyChannels(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    await this.chatSpaces.ensureGeneralSpace(orgId, userId);
    await this.ensureGeneralMembership(userId, orgId);

    const channels = await this.prisma.channel.findMany({
      where: { orgId, members: { some: { userId } } },
      include: { members: { include: { user: { select: USER_SELECT } } } },
      orderBy: { updatedAt: 'desc' },
    });

    return Promise.all(channels.map((channel) => this.decorateChannel(channel, userId)));
  }

  async listChannelsBySpace(userId: string, spaceId: string) {
    await this.chatSpaces.assertChatSpaceMembership(userId, spaceId);

    const channels = await this.prisma.channel.findMany({
      where: { spaceId, members: { some: { userId } } },
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
    await this.chatSpaces.assertChatSpaceMembership(userId, input.spaceId);
    const memberIds = await this.resolveOrgMemberIds(input.orgId, [
      userId,
      ...(input.memberIds ?? []),
    ]);

    const channel = await this.prisma.channel.create({
      data: {
        orgId: input.orgId,
        spaceId: input.spaceId,
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

  async openDirectChannel(
    userId: string,
    orgId: string,
    targetUserId: string,
    spaceId: string,
  ) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    await this.tenancy.assertOrgMembership(targetUserId, orgId);
    await this.chatSpaces.assertChatSpaceMembership(userId, spaceId);
    if (userId === targetUserId) {
      throw new ForbiddenException('Não é possível abrir conversa consigo mesmo');
    }

    const dmKey = [userId, targetUserId].sort().join(':');
    const existing = await this.prisma.channel.findUnique({
      where: { orgId_dmKey: { orgId, dmKey } },
    });
    if (existing) {
      if (existing.spaceId !== spaceId) {
        await this.prisma.channel.update({ where: { id: existing.id }, data: { spaceId } });
      }
      return this.findChannelById(userId, existing.id);
    }

    const channel = await this.prisma.channel.create({
      data: {
        orgId,
        spaceId,
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
    const body = input.body?.trim() ?? '';
    const attachmentIds = input.attachmentIds ?? [];
    if (!body && attachmentIds.length === 0) {
      throw new BadRequestException('A mensagem precisa de texto ou ao menos um anexo');
    }

    const channel = await this.prisma.channel.findUnique({
      where: { id: input.channelId },
      select: { id: true, orgId: true },
    });
    if (!channel) throw new NotFoundException('Canal não encontrado');
    await this.assertChannelMembership(userId, input.channelId);

    if (attachmentIds.length > 0) {
      await this.assertAttachmentsOwnership(userId, channel.orgId, attachmentIds);
    }

    const message = await this.prisma.$transaction(async (tx) => {
      const created = await tx.message.create({
        data: {
          channelId: input.channelId,
          authorId: userId,
          body,
          replyToId: input.replyToId,
        },
        include: { author: { select: USER_SELECT } },
      });

      if (attachmentIds.length > 0) {
        await tx.messageAttachment.createMany({
          data: attachmentIds.map((attachmentId) => ({
            messageId: created.id,
            attachmentId,
          })),
        });
      }

      await tx.channel.update({
        where: { id: input.channelId },
        data: { updatedAt: new Date() },
      });

      return created;
    });

    const attachments = attachmentIds.length
      ? await this.prisma.attachment.findMany({
          where: { id: { in: attachmentIds } },
          orderBy: { createdAt: 'asc' },
        })
      : [];

    await this.pubSub.publish(CHAT_EVENTS.messageReceived, {
      [CHAT_EVENTS.messageReceived]: { ...message, attachments },
      channelId: message.channelId,
    });

    return message;
  }

  private async assertAttachmentsOwnership(
    userId: string,
    orgId: string,
    attachmentIds: string[],
  ) {
    const attachments = await this.prisma.attachment.findMany({
      where: { id: { in: attachmentIds }, orgId, uploaderId: userId },
      select: { id: true },
    });
    if (attachments.length !== attachmentIds.length) {
      throw new ForbiddenException('Anexo inválido ou não pertence a você');
    }
  }

  async editMessage(userId: string, id: string, body: string) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message || message.deletedAt) throw new NotFoundException('Mensagem não encontrada');
    if (message.authorId !== userId) {
      throw new ForbiddenException('Apenas o autor pode editar a mensagem');
    }
    const updated = await this.prisma.message.update({
      where: { id },
      data: { body, editedAt: new Date() },
      include: { author: { select: USER_SELECT } },
    });

    await this.pubSub.publish(CHAT_EVENTS.messageEdited, {
      [CHAT_EVENTS.messageEdited]: updated,
      channelId: updated.channelId,
    });

    return updated;
  }

  async removeMessage(userId: string, id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: { channel: { select: { orgId: true, spaceId: true } } },
    });
    if (!message || message.deletedAt) throw new NotFoundException('Mensagem não encontrada');
    if (message.authorId !== userId) {
      const spaceId =
        message.channel.spaceId ??
        (await this.chatSpaces.ensureGeneralSpace(message.channel.orgId, userId)).id;
      await this.chatSpaces.assertChatSpaceAdmin(userId, spaceId);
    }
    await this.prisma.message.update({
      where: { id },
      data: { deletedAt: new Date(), body: '' },
    });

    await this.pubSub.publish(CHAT_EVENTS.messageDeleted, {
      [CHAT_EVENTS.messageDeleted]: { id, channelId: message.channelId },
      channelId: message.channelId,
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

  async addReactionToMessage(userId: string, input: AddReactionInput) {
    const message = await this.findActiveMessageById(input.messageId);
    await this.assertChannelMembership(userId, message.channelId);

    const reaction = await this.prisma.messageReaction.upsert({
      where: {
        messageId_userId_emoji: {
          messageId: input.messageId,
          userId,
          emoji: input.emoji,
        },
      },
      create: { messageId: input.messageId, userId, emoji: input.emoji },
      update: {},
    });

    await this.publishReactionChanged(input.messageId, message.channelId);
    return reaction;
  }

  async removeReactionFromMessage(userId: string, messageId: string, emoji: string) {
    const message = await this.findActiveMessageById(messageId);
    await this.assertChannelMembership(userId, message.channelId);

    await this.prisma.messageReaction.deleteMany({
      where: { messageId, userId, emoji },
    });

    await this.publishReactionChanged(messageId, message.channelId);
    return true;
  }

  async listMessageReactionGroups(messageId: string, currentUserId: string | null) {
    const rows = await this.prisma.messageReaction.findMany({
      where: { messageId },
      orderBy: { createdAt: 'asc' },
      select: { userId: true, emoji: true },
    });

    const groups = new Map<string, ReactionGroup>();
    for (const row of rows) {
      const group =
        groups.get(row.emoji) ??
        ({ emoji: row.emoji, count: 0, reactedByMe: false, userIds: [] } as ReactionGroup);
      group.count += 1;
      group.userIds.push(row.userId);
      if (currentUserId && row.userId === currentUserId) group.reactedByMe = true;
      groups.set(row.emoji, group);
    }
    return [...groups.values()];
  }

  private async publishReactionChanged(messageId: string, channelId: string) {
    const reactions = await this.listMessageReactionGroups(messageId, null);
    await this.pubSub.publish(CHAT_EVENTS.reactionChanged, {
      [CHAT_EVENTS.reactionChanged]: { messageId, channelId, reactions },
      channelId,
    });
  }

  private async findActiveMessageById(id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      select: { id: true, channelId: true, deletedAt: true },
    });
    if (!message || message.deletedAt) throw new NotFoundException('Mensagem não encontrada');
    return message;
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
