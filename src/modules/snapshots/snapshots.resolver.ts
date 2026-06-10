import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SnapshotsService } from './snapshots.service';
import { SprintSnapshot } from './models/sprint-snapshot.model';
import { VelocityPoint } from './models/velocity-point.model';
import { SprintTagSlice } from './models/sprint-tag-slice.model';
import { SprintMemberLoad } from './models/sprint-member-load.model';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver()
export class SnapshotsResolver {
  constructor(private readonly snapshotsService: SnapshotsService) {}

  @Query(() => [SprintSnapshot])
  @UseGuards(GqlAuthGuard)
  listSprintBurndown(
    @CurrentUser() user: AuthenticatedUser,
    @Args('sprintId', { type: () => ID }) sprintId: string,
  ): Promise<SprintSnapshot[]> {
    return this.snapshotsService.listSnapshotsBySprint(user.id, sprintId) as Promise<SprintSnapshot[]>;
  }

  @Query(() => [VelocityPoint])
  @UseGuards(GqlAuthGuard)
  listSprintVelocity(
    @CurrentUser() user: AuthenticatedUser,
    @Args('projectId', { type: () => ID }) projectId: string,
  ): Promise<VelocityPoint[]> {
    return this.snapshotsService.listVelocityByProject(user.id, projectId);
  }

  @Query(() => [SprintTagSlice])
  @UseGuards(GqlAuthGuard)
  listSprintTagComposition(
    @CurrentUser() user: AuthenticatedUser,
    @Args('sprintId', { type: () => ID }) sprintId: string,
  ): Promise<SprintTagSlice[]> {
    return this.snapshotsService.listSprintTagComposition(user.id, sprintId) as Promise<
      SprintTagSlice[]
    >;
  }

  @Query(() => [SprintMemberLoad])
  @UseGuards(GqlAuthGuard)
  listSprintMemberLoad(
    @CurrentUser() user: AuthenticatedUser,
    @Args('sprintId', { type: () => ID }) sprintId: string,
  ): Promise<SprintMemberLoad[]> {
    return this.snapshotsService.listSprintMemberLoad(user.id, sprintId) as Promise<
      SprintMemberLoad[]
    >;
  }
}
