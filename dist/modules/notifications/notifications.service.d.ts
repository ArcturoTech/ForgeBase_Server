import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from "../../prisma/prisma.service";
import { TenancyService } from "../../common/tenancy/tenancy.service";
import { CreateNotificationInput } from './dto/create-notification.input';
export declare const NOTIFICATION_EVENTS: {
    readonly received: "notificationReceived";
};
export declare class NotificationsService {
    private readonly prisma;
    private readonly tenancy;
    private readonly pubSub;
    constructor(prisma: PrismaService, tenancy: TenancyService, pubSub: PubSub);
    listNotifications(userId: string, orgId: string): Promise<{
        id: string;
        orgId: string;
        userId: string;
        type: string;
        title: string;
        body: string | null;
        read: boolean;
        createdAt: Date;
    }[]>;
    markNotificationRead(userId: string, id: string): Promise<{
        id: string;
        orgId: string;
        userId: string;
        type: string;
        title: string;
        body: string | null;
        read: boolean;
        createdAt: Date;
    }>;
    removeNotification(userId: string, id: string): Promise<boolean>;
    markAllNotificationsRead(userId: string, orgId: string): Promise<number>;
    createNotification(userId: string, input: CreateNotificationInput): Promise<{
        id: string;
        orgId: string;
        userId: string;
        type: string;
        title: string;
        body: string | null;
        read: boolean;
        createdAt: Date;
    }>;
}
