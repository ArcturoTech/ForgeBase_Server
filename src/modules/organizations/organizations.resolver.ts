import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { Organization } from './models/organization.model';
import { FeatureFlag } from './models/feature-flag.model';
import { PaginatedOrganizations } from './models/paginated-organizations.model';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { PaginationInput } from '@/common/pagination/pagination.input';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { GqlRolesGuard } from '@/common/guards/gql-roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/prisma/prisma-client';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver(() => Organization)
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Query(() => [Organization])
  @UseGuards(GqlAuthGuard)
  listMyOrganizations(@CurrentUser() user: AuthenticatedUser): Promise<Organization[]> {
    return this.organizationsService.listOrganizationsForUser(user.id) as Promise<Organization[]>;
  }

  @Query(() => PaginatedOrganizations)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(Role.ADMIN)
  listOrganizations(
    @Args('pagination') pagination: PaginationInput,
  ): Promise<PaginatedOrganizations> {
    return this.organizationsService.listOrganizations(pagination) as Promise<PaginatedOrganizations>;
  }

  @Query(() => Organization)
  @UseGuards(GqlAuthGuard)
  findOrganizationBySlug(
    @CurrentUser() user: AuthenticatedUser,
    @Args('slug') slug: string,
  ): Promise<Organization> {
    return this.organizationsService.findOrganizationBySlug(user.id, slug) as Promise<Organization>;
  }

  @Query(() => [FeatureFlag])
  @UseGuards(GqlAuthGuard)
  listFeatureFlags(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
  ): Promise<FeatureFlag[]> {
    return this.organizationsService.listFeatureFlags(user.id, orgId) as Promise<FeatureFlag[]>;
  }

  @Mutation(() => Organization)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(Role.ADMIN)
  createOrganization(@Args('input') input: CreateOrganizationInput): Promise<Organization> {
    return this.organizationsService.createOrganization(input) as Promise<Organization>;
  }

  @Mutation(() => Organization)
  @UseGuards(GqlAuthGuard)
  updateOrganization(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: UpdateOrganizationInput,
  ): Promise<Organization> {
    return this.organizationsService.updateOrganization(user.id, input) as Promise<Organization>;
  }

  @Mutation(() => FeatureFlag)
  @UseGuards(GqlAuthGuard)
  toggleFeatureFlag(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
    @Args('key') key: string,
  ): Promise<FeatureFlag> {
    return this.organizationsService.toggleFeatureFlag(user.id, orgId, key) as Promise<FeatureFlag>;
  }
}
