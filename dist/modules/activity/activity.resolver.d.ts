import { PubSub } from 'graphql-subscriptions';
import { ActivityService } from './activity.service';
import { Activity } from './models/activity.model';
import { User } from "../../users/models/user.model";
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
export declare class ActivityResolver {
    private readonly activityService;
    private readonly pubSub;
    constructor(activityService: ActivityService, pubSub: PubSub);
    listActivityFeed(user: AuthenticatedUser, orgId: string): Promise<Activity[]>;
    actor(activity: Activity & {
        userId: string;
    }): Promise<User | null>;
    activityRecorded(_orgId: string): AsyncIterator<unknown, any, any>;
}
