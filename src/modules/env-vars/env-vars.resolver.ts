import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EnvScope } from '@/common/graphql/enums';
import { EnvVarsService } from './env-vars.service';
import { ProjectEnvVar } from './models/project-env-var.model';
import { CreateProjectEnvVarInput } from './dto/create-project-env-var.input';
import { UpdateProjectEnvVarInput } from './dto/update-project-env-var.input';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver(() => ProjectEnvVar)
export class EnvVarsResolver {
  constructor(private readonly envVarsService: EnvVarsService) {}

  @Query(() => [ProjectEnvVar])
  @UseGuards(GqlAuthGuard)
  listProjectEnvVars(
    @CurrentUser() user: AuthenticatedUser,
    @Args('projectId', { type: () => ID }) projectId: string,
  ): Promise<ProjectEnvVar[]> {
    return this.envVarsService.listProjectEnvVars(user.id, projectId) as Promise<ProjectEnvVar[]>;
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  revealProjectEnvVar(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<string> {
    return this.envVarsService.revealProjectEnvVar(user.id, id);
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  exportProjectEnvFile(
    @CurrentUser() user: AuthenticatedUser,
    @Args('projectId', { type: () => ID }) projectId: string,
    @Args('scope', { type: () => EnvScope }) scope: EnvScope,
  ): Promise<string> {
    return this.envVarsService.exportProjectEnvFile(user.id, projectId, scope);
  }

  @Mutation(() => ProjectEnvVar)
  @UseGuards(GqlAuthGuard)
  createProjectEnvVar(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateProjectEnvVarInput,
  ): Promise<ProjectEnvVar> {
    return this.envVarsService.createProjectEnvVar(user.id, input) as Promise<ProjectEnvVar>;
  }

  @Mutation(() => ProjectEnvVar)
  @UseGuards(GqlAuthGuard)
  updateProjectEnvVar(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: UpdateProjectEnvVarInput,
  ): Promise<ProjectEnvVar> {
    return this.envVarsService.updateProjectEnvVar(user.id, input) as Promise<ProjectEnvVar>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeProjectEnvVar(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.envVarsService.removeProjectEnvVar(user.id, id);
  }
}
