import {
  Args,
  Context,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { IssuesService, ISSUE_EVENTS } from './issues.service';
import { Issue } from './models/issue.model';
import { Subtask } from './models/subtask.model';
import { Label } from './models/label.model';
import { IssueComment } from './models/issue-comment.model';
import { Column } from '@/modules/boards/models/column.model';
import { CreateIssueInput } from './dto/create-issue.input';
import { UpdateIssueInput } from './dto/update-issue.input';
import { MoveIssueInput } from './dto/move-issue.input';
import { AddCommentToIssueInput, AddSubtaskInput } from './dto/issue-content.input';
import { AssignIssueToSprintInput } from './dto/assign-issue-to-sprint.input';
import { AssignUserToIssueInput } from './dto/assign-user-to-issue.input';
import { User } from '@/users/models/user.model';
import { Activity } from '@/modules/activity/models/activity.model';
import { PUB_SUB } from '@/common/pubsub/pubsub.module';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';
import type { AppLoaders } from '@/common/dataloader/loaders';

interface IssueEventPayload {
  boardId: string;
}

@Resolver(() => Issue)
export class IssuesResolver {
  constructor(
    private readonly issuesService: IssuesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => [Issue])
  @UseGuards(GqlAuthGuard)
  listIssuesByBoard(
    @CurrentUser() user: AuthenticatedUser,
    @Args('boardId', { type: () => ID }) boardId: string,
  ): Promise<Issue[]> {
    return this.issuesService.listIssuesByBoard(user.id, boardId) as Promise<Issue[]>;
  }

  @Query(() => Issue)
  @UseGuards(GqlAuthGuard)
  findIssueById(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Issue> {
    return this.issuesService.findIssueById(user.id, id) as Promise<Issue>;
  }

  @Mutation(() => Issue)
  @UseGuards(GqlAuthGuard)
  createIssue(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateIssueInput,
  ): Promise<Issue> {
    return this.issuesService.createIssue(user.id, input) as Promise<Issue>;
  }

  @Mutation(() => Issue)
  @UseGuards(GqlAuthGuard)
  updateIssue(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: UpdateIssueInput,
  ): Promise<Issue> {
    return this.issuesService.updateIssue(user.id, input) as Promise<Issue>;
  }

  @Mutation(() => Issue)
  @UseGuards(GqlAuthGuard)
  moveIssue(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: MoveIssueInput,
  ): Promise<Issue> {
    return this.issuesService.moveIssue(user.id, input) as Promise<Issue>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeIssue(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.issuesService.removeIssue(user.id, id);
  }

  @Query(() => [Issue])
  @UseGuards(GqlAuthGuard)
  listMyAssignedIssues(@CurrentUser() user: AuthenticatedUser): Promise<Issue[]> {
    return this.issuesService.listIssuesAssignedToUser(user.id) as Promise<Issue[]>;
  }

  @Query(() => [Issue])
  @UseGuards(GqlAuthGuard)
  listBacklogIssuesByProject(
    @CurrentUser() user: AuthenticatedUser,
    @Args('projectId', { type: () => ID }) projectId: string,
  ): Promise<Issue[]> {
    return this.issuesService.listBacklogIssuesByProject(user.id, projectId) as Promise<Issue[]>;
  }

  @Query(() => [Issue])
  @UseGuards(GqlAuthGuard)
  listEpicsByProject(
    @CurrentUser() user: AuthenticatedUser,
    @Args('projectId', { type: () => ID }) projectId: string,
  ): Promise<Issue[]> {
    return this.issuesService.listEpicsByProject(user.id, projectId) as Promise<Issue[]>;
  }

  @Query(() => [Issue])
  @UseGuards(GqlAuthGuard)
  listIssuesByEpic(
    @CurrentUser() user: AuthenticatedUser,
    @Args('epicId', { type: () => ID }) epicId: string,
  ): Promise<Issue[]> {
    return this.issuesService.listIssuesByEpic(user.id, epicId) as Promise<Issue[]>;
  }

  @Mutation(() => Issue)
  @UseGuards(GqlAuthGuard)
  assignIssueToSprint(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: AssignIssueToSprintInput,
  ): Promise<Issue> {
    return this.issuesService.assignIssueToSprint(user.id, input) as Promise<Issue>;
  }

  @Mutation(() => Issue)
  @UseGuards(GqlAuthGuard)
  assignUserToIssue(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: AssignUserToIssueInput,
  ): Promise<Issue> {
    return this.issuesService.assignUserToIssue(user.id, input) as Promise<Issue>;
  }

  @Mutation(() => Issue)
  @UseGuards(GqlAuthGuard)
  unassignUserFromIssue(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: AssignUserToIssueInput,
  ): Promise<Issue> {
    return this.issuesService.unassignUserFromIssue(user.id, input) as Promise<Issue>;
  }

  @Query(() => [Activity])
  @UseGuards(GqlAuthGuard)
  listActivityByIssue(
    @CurrentUser() user: AuthenticatedUser,
    @Args('issueId', { type: () => ID }) issueId: string,
  ): Promise<Activity[]> {
    return this.issuesService.listActivityByIssue(user.id, issueId) as Promise<Activity[]>;
  }

  @Mutation(() => Subtask)
  @UseGuards(GqlAuthGuard)
  addSubtaskToIssue(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: AddSubtaskInput,
  ): Promise<Subtask> {
    return this.issuesService.addSubtaskToIssue(user.id, input) as Promise<Subtask>;
  }

  @Mutation(() => Subtask)
  @UseGuards(GqlAuthGuard)
  toggleSubtask(
    @CurrentUser() user: AuthenticatedUser,
    @Args('subtaskId', { type: () => ID }) subtaskId: string,
  ): Promise<Subtask> {
    return this.issuesService.toggleSubtask(user.id, subtaskId) as Promise<Subtask>;
  }

  @Mutation(() => IssueComment)
  @UseGuards(GqlAuthGuard)
  addCommentToIssue(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: AddCommentToIssueInput,
  ): Promise<IssueComment> {
    return this.issuesService.addCommentToIssue(user.id, input) as Promise<IssueComment>;
  }

  @ResolveField(() => [Issue], { nullable: true })
  children(@Parent() issue: Issue): Promise<Issue[]> {
    return this.issuesService.listIssuesByParent(issue.id) as Promise<Issue[]>;
  }

  @ResolveField(() => [User])
  assignees(@Parent() issue: Issue, @Context('loaders') loaders: AppLoaders): Promise<User[]> {
    return loaders.issueAssignees.load(issue.id);
  }

  @ResolveField(() => [Label])
  labels(@Parent() issue: Issue, @Context('loaders') loaders: AppLoaders): Promise<Label[]> {
    return loaders.issueLabels.load(issue.id);
  }

  @ResolveField(() => [Subtask])
  subtasks(@Parent() issue: Issue, @Context('loaders') loaders: AppLoaders): Promise<Subtask[]> {
    return loaders.issueSubtasks.load(issue.id);
  }

  @ResolveField(() => [IssueComment])
  comments(@Parent() issue: Issue, @Context('loaders') loaders: AppLoaders): Promise<IssueComment[]> {
    return loaders.issueComments.load(issue.id);
  }

  @ResolveField(() => Column)
  column(@Parent() issue: Issue): Promise<Column> {
    return this.issuesService.findColumnByIssue(issue.columnId) as Promise<Column>;
  }

  @Subscription(() => Issue, {
    filter: (payload: IssueEventPayload, variables: { boardId: string }) =>
      payload.boardId === variables.boardId,
  })
  issueMoved(@Args('boardId', { type: () => ID }) _boardId: string) {
    return this.pubSub.asyncIterator(ISSUE_EVENTS.moved);
  }

  @Subscription(() => Issue, {
    filter: (payload: IssueEventPayload, variables: { boardId: string }) =>
      payload.boardId === variables.boardId,
  })
  issueCreated(@Args('boardId', { type: () => ID }) _boardId: string) {
    return this.pubSub.asyncIterator(ISSUE_EVENTS.created);
  }

  @Subscription(() => Issue, {
    filter: (payload: IssueEventPayload, variables: { boardId: string }) =>
      payload.boardId === variables.boardId,
  })
  issueUpdated(@Args('boardId', { type: () => ID }) _boardId: string) {
    return this.pubSub.asyncIterator(ISSUE_EVENTS.updated);
  }

  @Subscription(() => Issue, {
    filter: (payload: IssueEventPayload, variables: { boardId: string }) =>
      payload.boardId === variables.boardId,
  })
  issueCommented(@Args('boardId', { type: () => ID }) _boardId: string) {
    return this.pubSub.asyncIterator(ISSUE_EVENTS.commented);
  }
}
