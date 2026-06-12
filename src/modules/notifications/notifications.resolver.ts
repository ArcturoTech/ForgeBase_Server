import { Args, ID, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { NotificationsService, NOTIFICATION_EVENTS } from './notifications.service';
import { Notification } from './models/notification.model';
import { NotificationPreference } from './models/notification-preference.model';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationPrefsInput } from './dto/update-notification-prefs.input';
import { PUB_SUB } from '@/common/pubsub/pubsub.module';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

interface NotificationEventPayload {
  userId: string;
}

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => [Notification])
  @UseGuards(GqlAuthGuard)
  listNotifications(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
  ): Promise<Notification[]> {
    return this.notificationsService.listNotifications(user.id, orgId) as Promise<Notification[]>;
  }

  @Mutation(() => Notification)
  @UseGuards(GqlAuthGuard)
  markNotificationRead(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Notification> {
    return this.notificationsService.markNotificationRead(user.id, id) as Promise<Notification>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeNotification(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.notificationsService.removeNotification(user.id, id);
  }

  @Mutation(() => Int)
  @UseGuards(GqlAuthGuard)
  markAllNotificationsRead(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
  ): Promise<number> {
    return this.notificationsService.markAllNotificationsRead(user.id, orgId);
  }

  @Mutation(() => Notification)
  @UseGuards(GqlAuthGuard)
  createNotification(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateNotificationInput,
  ): Promise<Notification> {
    return this.notificationsService.createNotification(user.id, input) as Promise<Notification>;
  }

  @Query(() => NotificationPreference)
  @UseGuards(GqlAuthGuard)
  findMyNotificationPreferences(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<NotificationPreference> {
    return this.notificationsService.findNotificationPreferencesByUserId(user.id) as Promise<NotificationPreference>;
  }

  @Mutation(() => NotificationPreference)
  @UseGuards(GqlAuthGuard)
  updateNotificationPreferences(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: UpdateNotificationPrefsInput,
  ): Promise<NotificationPreference> {
    return this.notificationsService.updateNotificationPreferencesByUserId(user.id, input) as Promise<NotificationPreference>;
  }

  @Subscription(() => Notification, {
    filter: (payload: NotificationEventPayload, variables: { userId: string }) =>
      payload.userId === variables.userId,
  })
  notificationReceived(@Args('userId', { type: () => ID }) _userId: string) {
    return this.pubSub.asyncIterator(NOTIFICATION_EVENTS.received);
  }
}
