import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';
import { TimerService } from './timer.service';
import { TimeEntry } from './models/time-entry.model';
import { StartTimerInput } from './dto/start-timer.input';

@Resolver(() => TimeEntry)
@UseGuards(GqlAuthGuard)
export class TimerResolver {
  constructor(private readonly timerService: TimerService) {}

  @Query(() => TimeEntry, { nullable: true })
  async activeTimer(@CurrentUser() user: AuthenticatedUser) {
    return this.timerService.getActiveTimer(user.id);
  }

  @Mutation(() => TimeEntry)
  async startTimer(
    @Args('input') input: StartTimerInput,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.timerService.startTimer(user.id, input);
  }

  @Mutation(() => TimeEntry)
  async stopTimer(@CurrentUser() user: AuthenticatedUser) {
    return this.timerService.stopTimer(user.id);
  }
}
