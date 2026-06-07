import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ProjectResource } from './models/project-resource.model';
import { CreateProjectResourceInput } from './dto/create-project-resource.input';
import { UpdateProjectResourceInput } from './dto/update-project-resource.input';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver(() => ProjectResource)
export class ResourcesResolver {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Query(() => [ProjectResource])
  @UseGuards(GqlAuthGuard)
  listProjectResources(
    @CurrentUser() user: AuthenticatedUser,
    @Args('projectId', { type: () => ID }) projectId: string,
  ): Promise<ProjectResource[]> {
    return this.resourcesService.listProjectResources(
      user.id,
      projectId,
    ) as Promise<ProjectResource[]>;
  }

  @Mutation(() => ProjectResource)
  @UseGuards(GqlAuthGuard)
  createProjectResource(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateProjectResourceInput,
  ): Promise<ProjectResource> {
    return this.resourcesService.createProjectResource(user.id, input) as Promise<ProjectResource>;
  }

  @Mutation(() => ProjectResource)
  @UseGuards(GqlAuthGuard)
  updateProjectResource(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: UpdateProjectResourceInput,
  ): Promise<ProjectResource> {
    return this.resourcesService.updateProjectResource(user.id, input) as Promise<ProjectResource>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeProjectResource(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.resourcesService.removeProjectResource(user.id, id);
  }
}
