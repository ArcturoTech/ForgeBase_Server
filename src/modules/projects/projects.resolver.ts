import { Args, ID, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './models/project.model';
import { Milestone } from './models/milestone.model';
import { ProjectMember } from './models/project-member.model';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { AddProjectMemberInput } from './dto/add-project-member.input';
import { UpdateProjectMemberInput } from './dto/update-project-member.input';
import { RemoveProjectMemberInput } from './dto/remove-project-member.input';
import { User } from '@/users/models/user.model';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [Project])
  @UseGuards(GqlAuthGuard)
  listProjects(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
  ): Promise<Project[]> {
    return this.projectsService.listProjects(user.id, orgId) as Promise<Project[]>;
  }

  @Query(() => Project)
  @UseGuards(GqlAuthGuard)
  findProjectById(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Project> {
    return this.projectsService.findProjectById(user.id, id) as Promise<Project>;
  }

  @Query(() => [Milestone])
  @UseGuards(GqlAuthGuard)
  listProjectMilestones(
    @CurrentUser() user: AuthenticatedUser,
    @Args('projectId', { type: () => ID }) projectId: string,
  ): Promise<Milestone[]> {
    return this.projectsService.listMilestonesByProject(user.id, projectId) as Promise<Milestone[]>;
  }

  @Mutation(() => Project)
  @UseGuards(GqlAuthGuard)
  createProject(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateProjectInput,
  ): Promise<Project> {
    return this.projectsService.createProject(user.id, input) as Promise<Project>;
  }

  @Mutation(() => Project)
  @UseGuards(GqlAuthGuard)
  updateProject(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: UpdateProjectInput,
  ): Promise<Project> {
    return this.projectsService.updateProject(user.id, input) as Promise<Project>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeProject(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.projectsService.removeProject(user.id, id);
  }

  @Query(() => [ProjectMember])
  @UseGuards(GqlAuthGuard)
  listProjectMembers(
    @CurrentUser() user: AuthenticatedUser,
    @Args('projectId', { type: () => ID }) projectId: string,
  ): Promise<ProjectMember[]> {
    return this.projectsService.listProjectMembers(user.id, projectId) as Promise<ProjectMember[]>;
  }

  @Mutation(() => ProjectMember)
  @UseGuards(GqlAuthGuard)
  addProjectMember(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: AddProjectMemberInput,
  ): Promise<ProjectMember> {
    return this.projectsService.addProjectMember(user.id, input) as Promise<ProjectMember>;
  }

  @Mutation(() => ProjectMember)
  @UseGuards(GqlAuthGuard)
  updateProjectMember(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: UpdateProjectMemberInput,
  ): Promise<ProjectMember> {
    return this.projectsService.updateProjectMember(user.id, input) as Promise<ProjectMember>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeProjectMember(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: RemoveProjectMemberInput,
  ): Promise<boolean> {
    return this.projectsService.removeProjectMember(user.id, input);
  }

  @ResolveField(() => [ProjectMember])
  members(@Parent() project: Project): Promise<ProjectMember[]> {
    if (project.members) return Promise.resolve(project.members);
    return this.projectsService.listMembersByProject(project.id) as Promise<ProjectMember[]>;
  }

  @ResolveField(() => Int)
  sprintCount(@Parent() project: Project): Promise<number> {
    return this.projectsService.countSprintsByProject(project.id);
  }
}

@Resolver(() => ProjectMember)
export class ProjectMemberResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @ResolveField(() => User)
  user(@Parent() member: ProjectMember): Promise<User> {
    if (member.user) return Promise.resolve(member.user);
    return this.projectsService.findUserByProjectMember(member.userId) as Promise<User>;
  }
}
