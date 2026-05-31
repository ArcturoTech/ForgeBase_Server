import { Args, ID, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { ActivityService, ACTIVITY_EVENTS } from './activity.service';
import { Activity } from './models/activity.model';
import { User } from '@/users/models/user.model';
import { PUB_SUB } from '@/common/pubsub/pubsub.module';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

interface ActivityEventPayload {
  orgId: string;
}

@Resolver(() => Activity)
export class ActivityResolver {
  constructor(
    private readonly activityService: ActivityService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => [Activity])
  @UseGuards(GqlAuthGuard)
  listActivityFeed(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
  ): Promise<Activity[]> {
    return this.activityService.listActivityByOrg(user.id, orgId) as Promise<Activity[]>;
  }

  @ResolveField(() => User, { nullable: true })
  actor(@Parent() activity: Activity & { userId: string }): Promise<User | null> {
    return this.activityService.findActivityActor(activity.userId) as Promise<User | null>;
  }

  @Subscription(() => Activity, {
    filter: (payload: ActivityEventPayload, variables: { orgId: string }) => payload.orgId === variables.orgId,
  })
  activityRecorded(@Args('orgId', { type: () => ID }) _orgId: string) {
    return this.pubSub.asyncIterator(ACTIVITY_EVENTS.recorded);
  }
}
