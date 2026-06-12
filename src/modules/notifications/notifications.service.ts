import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from '@/prisma/prisma.service';
import { PUB_SUB } from '@/common/pubsub/pubsub.module';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationPrefsInput } from './dto/update-notification-prefs.input';

export const NOTIFICATION_EVENTS = {
  received: 'notificationReceived',
} as const;

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async listNotifications(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.notification.findMany({
      where: { orgId, userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markNotificationRead(userId: string, id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('Notificação não encontrada');
    await this.tenancy.assertOrgMembership(userId, notification.orgId);
    if (notification.userId !== userId) {
      throw new ForbiddenException('Acesso negado a esta notificação');
    }
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async removeNotification(userId: string, id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('Notificação não encontrada');
    await this.tenancy.assertOrgMembership(userId, notification.orgId);
    if (notification.userId !== userId) {
      throw new ForbiddenException('Acesso negado a esta notificação');
    }
    await this.prisma.notification.delete({ where: { id } });
    return true;
  }

  async markAllNotificationsRead(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    const result = await this.prisma.notification.updateMany({
      where: { orgId, userId, read: false },
      data: { read: true },
    });
    return result.count;
  }

  async createNotification(userId: string, input: CreateNotificationInput) {
    await this.tenancy.assertOrgMembership(userId, input.orgId);
    return this.createNotificationInternal(input);
  }

  async createNotificationInternal(input: Omit<CreateNotificationInput, never>) {
    const notification = await this.prisma.notification.create({
      data: {
        orgId: input.orgId,
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body,
      },
    });
    await this.pubSub.publish(NOTIFICATION_EVENTS.received, {
      [NOTIFICATION_EVENTS.received]: notification,
      userId: notification.userId,
    });
    return notification;
  }

  async findNotificationPreferencesByUserId(userId: string) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  async updateNotificationPreferencesByUserId(userId: string, input: UpdateNotificationPrefsInput) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      create: { userId, ...input },
      update: input,
    });
  }
}
