import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from "../../prisma/prisma.service";
import { TenancyService } from "../../common/tenancy/tenancy.service";
export declare const ACTIVITY_EVENTS: {
    readonly recorded: "activityRecorded";
};
type RecordActivityInput = {
    orgId: string;
    userId: string;
    action: string;
    targetType?: string;
    targetId?: string;
};
export declare class ActivityService {
    private readonly prisma;
    private readonly tenancy;
    private readonly pubSub;
    constructor(prisma: PrismaService, tenancy: TenancyService, pubSub: PubSub);
    recordActivity(input: RecordActivityInput): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        orgId: string;
        action: string;
        targetType: string | null;
        targetId: string | null;
    }>;
    listActivityByOrg(userId: string, orgId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        orgId: string;
        action: string;
        targetType: string | null;
        targetId: string | null;
    }[]>;
    listActivityByIssueKey(userId: string, orgId: string, issueKey: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        orgId: string;
        action: string;
        targetType: string | null;
        targetId: string | null;
    }[]>;
    findActivityActor(userId: string): import("generated/prisma").Prisma.Prisma__UserClient<{
        name: string | null;
        id: string;
        email: string;
        role: import("generated/prisma").$Enums.Role;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("generated/prisma/runtime/client").DefaultArgs, import("generated/prisma").Prisma.PrismaClientOptions>;
}
export {};
