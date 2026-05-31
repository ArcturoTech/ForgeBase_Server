import { PubSub } from 'graphql-subscriptions';
import { NotificationsService } from './notifications.service';
import { Notification } from './models/notification.model';
import { CreateNotificationInput } from './dto/create-notification.input';
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
export declare class NotificationsResolver {
    private readonly notificationsService;
    private readonly pubSub;
    constructor(notificationsService: NotificationsService, pubSub: PubSub);
    listNotifications(user: AuthenticatedUser, orgId: string): Promise<Notification[]>;
    markNotificationRead(user: AuthenticatedUser, id: string): Promise<Notification>;
    removeNotification(user: AuthenticatedUser, id: string): Promise<boolean>;
    markAllNotificationsRead(user: AuthenticatedUser, orgId: string): Promise<number>;
    createNotification(user: AuthenticatedUser, input: CreateNotificationInput): Promise<Notification>;
    notificationReceived(_userId: string): AsyncIterator<unknown, any, any>;
}
