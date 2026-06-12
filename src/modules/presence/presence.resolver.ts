import { Args, ID, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';
import { PUB_SUB } from '@/common/pubsub/pubsub.module';
import { UserStatus } from './models/user-status.model';
import { SetStatusInput } from './dto/set-status.input';
import { PingUserInput } from './dto/ping-user.input';
import { PresenceService, PRESENCE_EVENTS, isValidStatusPayload } from './presence.service';

@Resolver(() => UserStatus)
@UseGuards(GqlAuthGuard)
export class PresenceResolver {
  constructor(
    private readonly presenceService: PresenceService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => [UserStatus])
  async orgMemberStatuses(@Args('orgId', { type: () => ID }) orgId: string) {
    return this.presenceService.getOrgMemberStatuses(orgId);
  }

  @Mutation(() => UserStatus)
  async setMyStatus(
    @Args('input') input: SetStatusInput,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.presenceService.setUserStatus(user.id, input);
  }

  @Mutation(() => Boolean)
  async pingUser(
    @Args('input') input: PingUserInput,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.presenceService.pingUser(user.id, input);
  }

  @Subscription(() => UserStatus, {
    filter: (payload) => isValidStatusPayload(payload),
  })
  userStatusChanged(@Args('orgId', { type: () => ID }) _orgId: string) {
    return this.pubSub.asyncIterator(PRESENCE_EVENTS.statusChanged);
  }
}
