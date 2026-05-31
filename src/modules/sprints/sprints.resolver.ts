import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { IssuesService } from '@/modules/issues/issues.service';
import { Sprint } from './models/sprint.model';
import { SprintSummary } from './models/sprint-summary.model';
import { Issue } from '@/modules/issues/models/issue.model';
import { CreateSprintInput } from './dto/create-sprint.input';
import { UpdateSprintInput } from './dto/update-sprint.input';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver(() => Sprint)
export class SprintsResolver {
  constructor(
    private readonly sprintsService: SprintsService,
    private readonly issuesService: IssuesService,
  ) {}

  @Query(() => [Sprint])
  @UseGuards(GqlAuthGuard)
  listSprintsByProject(
    @CurrentUser() user: AuthenticatedUser,
    @Args('projectId', { type: () => ID }) projectId: string,
  ): Promise<Sprint[]> {
    return this.sprintsService.listSprintsByProject(user.id, projectId) as Promise<Sprint[]>;
  }

  @Query(() => SprintSummary, { nullable: true })
  @UseGuards(GqlAuthGuard)
  findActiveSprintSummary(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
  ): Promise<SprintSummary | null> {
    return this.sprintsService.findActiveSprintSummary(user.id, orgId) as Promise<SprintSummary | null>;
  }

  @Query(() => Sprint)
  @UseGuards(GqlAuthGuard)
  findSprintById(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Sprint> {
    return this.sprintsService.findSprintById(user.id, id) as Promise<Sprint>;
  }

  @Mutation(() => Sprint)
  @UseGuards(GqlAuthGuard)
  createSprint(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateSprintInput,
  ): Promise<Sprint> {
    return this.sprintsService.createSprint(user.id, input) as Promise<Sprint>;
  }

  @Mutation(() => Sprint)
  @UseGuards(GqlAuthGuard)
  updateSprint(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: UpdateSprintInput,
  ): Promise<Sprint> {
    return this.sprintsService.updateSprint(user.id, input) as Promise<Sprint>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeSprint(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.sprintsService.removeSprint(user.id, id);
  }

  @Mutation(() => Sprint)
  @UseGuards(GqlAuthGuard)
  startSprint(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Sprint> {
    return this.sprintsService.startSprintById(user.id, id) as Promise<Sprint>;
  }

  @Mutation(() => Sprint)
  @UseGuards(GqlAuthGuard)
  closeSprint(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Sprint> {
    return this.sprintsService.closeSprintById(user.id, id) as Promise<Sprint>;
  }

  @ResolveField(() => [Issue])
  issues(@Parent() sprint: Sprint): Promise<Issue[]> {
    return this.issuesService.listIssuesBySprint(sprint.id) as Promise<Issue[]>;
  }
}
