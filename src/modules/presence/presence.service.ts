import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from '@/prisma/prisma.service';
import { PUB_SUB } from '@/common/pubsub/pubsub.module';
import { PresenceStatus } from '@/common/graphql/enums';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { SetStatusInput } from './dto/set-status.input';
import { PingUserInput } from './dto/ping-user.input';

export const PRESENCE_EVENTS = {
  statusChanged: 'userStatusChanged',
} as const;

export function isValidStatusPayload(payload: unknown): boolean {
  if (typeof payload !== 'object' || payload === null) return false;
  const event = (payload as Record<string, unknown>)[PRESENCE_EVENTS.statusChanged];
  if (typeof event !== 'object' || event === null) return false;
  return typeof (event as Record<string, unknown>).userId === 'string';
}

@Injectable()
export class PresenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async setUserOnline(userId: string) {
    const existing = await this.prisma.userStatus.findUnique({ where: { userId } });
    if (existing?.isManual) return existing;
    return this.upsertStatus(userId, PresenceStatus.ONLINE, false);
  }

  async setUserOffline(userId: string) {
    return this.upsertStatus(userId, PresenceStatus.OFFLINE, false);
  }

  async setUserStatus(userId: string, input: SetStatusInput) {
    return this.upsertStatus(userId, input.status, input.isManual ?? true, input.emoji, input.customText);
  }


  async getOrgMemberStatuses(orgId: string) {
    const members = await this.prisma.membership.findMany({
      where: { orgId },
      select: { userId: true },
    });
    const userIds = members.map((m: { userId: string }) => m.userId);
    const statuses = await this.prisma.userStatus.findMany({
      where: { userId: { in: userIds } },
    });
    const statusMap = new Map(statuses.map((s) => [s.userId, s]));
    return userIds.map(
      (id) =>
        statusMap.get(id) ?? {
          userId: id,
          status: PresenceStatus.OFFLINE,
          emoji: null,
          customText: null,
          setAt: new Date(),
          isManual: false,
        },
    );
  }

  async pingUser(fromUserId: string, input: PingUserInput) {
    const tenSecondsAgo = new Date(Date.now() - 10_000);
    const recent = await this.prisma.pingRecord.findFirst({
      where: { fromUserId, toUserId: input.targetUserId, sentAt: { gt: tenSecondsAgo } },
    });
    if (recent) throw new BadRequestException('Aguarde 10 segundos entre pings');
    await this.prisma.pingRecord.create({ data: { fromUserId, toUserId: input.targetUserId } });
    const sender = await this.prisma.user.findUnique({ where: { id: fromUserId }, select: { name: true } });
    const senderName = sender?.name ?? 'Alguém';
    await this.notifications.createNotificationInternal({
      orgId: input.orgId,
      userId: input.targetUserId,
      type: 'PING',
      title: `${senderName} chamou sua atenção!`,
    });
    return true;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async hibernateInactiveUsers() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const stale = await this.prisma.userStatus.findMany({
      where: {
        status: PresenceStatus.ONLINE,
        isManual: false,
        setAt: { lt: fiveMinutesAgo },
      },
    });
    if (!stale.length) return;
    await this.prisma.userStatus.updateMany({
      where: { userId: { in: stale.map((s: { userId: string }) => s.userId) } },
      data: { status: PresenceStatus.HIBERNATING },
    });
    for (const s of stale) {
      await this.pubSub.publish(PRESENCE_EVENTS.statusChanged, {
        [PRESENCE_EVENTS.statusChanged]: {
          userId: s.userId,
          status: PresenceStatus.HIBERNATING,
          emoji: s.emoji,
          customText: s.customText,
          setAt: new Date(),
          isManual: false,
        },
      });
    }
  }

  private async upsertStatus(
    userId: string,
    status: PresenceStatus,
    isManual: boolean,
    emoji?: string,
    customText?: string,
  ) {
    const updated = await this.prisma.userStatus.upsert({
      where: { userId },
      create: { userId, status, isManual, emoji, customText },
      update: { status, isManual, emoji, customText, setAt: new Date() },
    });
    await this.pubSub.publish(PRESENCE_EVENTS.statusChanged, {
      [PRESENCE_EVENTS.statusChanged]: updated,
    });
    return updated;
  }
}
