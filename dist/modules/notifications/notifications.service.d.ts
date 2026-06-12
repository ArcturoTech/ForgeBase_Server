import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from "../../prisma/prisma.service";
import { TenancyService } from "../../common/tenancy/tenancy.service";
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationPrefsInput } from './dto/update-notification-prefs.input';
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
        createdAt: Date;
        body: string | null;
        orgId: string;
        userId: string;
        type: string;
        title: string;
        read: boolean;
    }[]>;
    markNotificationRead(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        body: string | null;
        orgId: string;
        userId: string;
        type: string;
        title: string;
        read: boolean;
    }>;
    removeNotification(userId: string, id: string): Promise<boolean>;
    markAllNotificationsRead(userId: string, orgId: string): Promise<number>;
    createNotification(userId: string, input: CreateNotificationInput): Promise<{
        id: string;
        createdAt: Date;
        body: string | null;
        orgId: string;
        userId: string;
        type: string;
        title: string;
        read: boolean;
    }>;
    createNotificationInternal(input: Omit<CreateNotificationInput, never>): Promise<{
        id: string;
        createdAt: Date;
        body: string | null;
        orgId: string;
        userId: string;
        type: string;
        title: string;
        read: boolean;
    }>;
    findNotificationPreferencesByUserId(userId: string): Promise<{
        userId: string;
        leadAssigned: boolean;
        dealUpdate: boolean;
        taskDue: boolean;
        chatMessage: boolean;
        weeklyDigest: boolean;
    }>;
    updateNotificationPreferencesByUserId(userId: string, input: UpdateNotificationPrefsInput): Promise<{
        userId: string;
        leadAssigned: boolean;
        dealUpdate: boolean;
        taskDue: boolean;
        chatMessage: boolean;
        weeklyDigest: boolean;
    }>;
}
