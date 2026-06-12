import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';
import { PersonalBoardService } from './personal-board.service';
import { PersonalTask } from './models/personal-task.model';
import { PersonalSprint } from './models/personal-sprint.model';
import { PersonalSprintSnapshot, PersonalVelocityPoint } from './models/personal-sprint-snapshot.model';
import { CreatePersonalTaskInput } from './dto/create-personal-task.input';
import { UpdatePersonalTaskInput } from './dto/update-personal-task.input';
import { CreatePersonalSprintInput } from './dto/create-personal-sprint.input';
import { UpdatePersonalSprintInput } from './dto/update-personal-sprint.input';
import { ClosePersonalSprintInput } from './dto/close-personal-sprint.input';

@Resolver(() => PersonalTask)
@UseGuards(GqlAuthGuard)
export class PersonalBoardResolver {
  constructor(private readonly personalBoardService: PersonalBoardService) {}

  @Query(() => [PersonalTask])
  async listPersonalTasks(
    @Args('orgId', { type: () => ID }) orgId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.personalBoardService.listPersonalTasks(user.id, orgId);
  }

  @Mutation(() => PersonalTask)
  async createPersonalTask(
    @Args('input') input: CreatePersonalTaskInput,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.personalBoardService.createPersonalTask(user.id, input);
  }

  @Mutation(() => PersonalTask)
  async updatePersonalTask(
    @Args('input') input: UpdatePersonalTaskInput,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.personalBoardService.updatePersonalTask(user.id, input);
  }

  @Mutation(() => Boolean)
  async removePersonalTask(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.personalBoardService.deletePersonalTask(user.id, id);
  }

  @Query(() => [PersonalSprint])
  async listPersonalSprints(
    @Args('orgId', { type: () => ID }) orgId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.personalBoardService.listPersonalSprints(user.id, orgId);
  }

  @Mutation(() => PersonalSprint)
  async createPersonalSprint(
    @Args('input') input: CreatePersonalSprintInput,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.personalBoardService.createPersonalSprint(user.id, input);
  }

  @Mutation(() => PersonalSprint)
  async updatePersonalSprint(
    @Args('input') input: UpdatePersonalSprintInput,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.personalBoardService.updatePersonalSprint(user.id, input);
  }

  @Mutation(() => PersonalSprint)
  async startPersonalSprint(
    @Args('sprintId', { type: () => ID }) sprintId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.personalBoardService.startPersonalSprint(user.id, sprintId);
  }

  @Mutation(() => PersonalSprint)
  async closePersonalSprint(
    @Args('input') input: ClosePersonalSprintInput,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.personalBoardService.closePersonalSprint(user.id, input);
  }

  @Mutation(() => PersonalSprint)
  async restartPersonalSprint(
    @Args('sprintId', { type: () => ID }) sprintId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.personalBoardService.restartPersonalSprint(user.id, sprintId);
  }

  @Mutation(() => Boolean)
  async removePersonalSprint(
    @Args('sprintId', { type: () => ID }) sprintId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.personalBoardService.deletePersonalSprint(user.id, sprintId);
  }

  @Query(() => [PersonalSprintSnapshot])
  async listPersonalSprintSnapshots(
    @Args('sprintId', { type: () => ID }) sprintId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.personalBoardService.listPersonalSprintSnapshots(user.id, sprintId);
  }

  @Query(() => [PersonalVelocityPoint])
  async listPersonalVelocityData(
    @Args('orgId', { type: () => ID }) orgId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.personalBoardService.listPersonalVelocityData(user.id, orgId);
  }

}
