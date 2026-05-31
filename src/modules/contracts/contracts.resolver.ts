import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { Contract } from './models/contract.model';
import { Project } from '@/modules/projects/models/project.model';
import { PaginatedContracts } from './models/paginated-contracts.model';
import { CreateContractInput } from './dto/create-contract.input';
import { UpdateContractInput } from './dto/update-contract.input';
import { PaginationInput } from '@/common/pagination/pagination.input';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver(() => Contract)
export class ContractsResolver {
  constructor(private readonly contractsService: ContractsService) {}

  @Query(() => PaginatedContracts)
  @UseGuards(GqlAuthGuard)
  listContracts(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
    @Args('pagination') pagination: PaginationInput,
  ): Promise<PaginatedContracts> {
    return this.contractsService.listContracts(
      user.id,
      orgId,
      pagination,
    ) as Promise<PaginatedContracts>;
  }

  @Query(() => Contract)
  @UseGuards(GqlAuthGuard)
  findContractById(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Contract> {
    return this.contractsService.findContractById(user.id, id) as Promise<Contract>;
  }

  @Query(() => [Contract])
  @UseGuards(GqlAuthGuard)
  listExpiringContracts(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
  ): Promise<Contract[]> {
    return this.contractsService.listExpiringContracts(user.id, orgId) as Promise<Contract[]>;
  }

  @Mutation(() => Contract)
  @UseGuards(GqlAuthGuard)
  createContract(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateContractInput,
  ): Promise<Contract> {
    return this.contractsService.createContract(user.id, input) as Promise<Contract>;
  }

  @Mutation(() => Contract)
  @UseGuards(GqlAuthGuard)
  updateContract(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: UpdateContractInput,
  ): Promise<Contract> {
    return this.contractsService.updateContract(user.id, input) as Promise<Contract>;
  }

  @Mutation(() => Contract)
  @UseGuards(GqlAuthGuard)
  renewContract(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('expiresAt', { type: () => Date }) expiresAt: Date,
  ): Promise<Contract> {
    return this.contractsService.renewContract(user.id, id, expiresAt) as Promise<Contract>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeContract(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.contractsService.removeContract(user.id, id);
  }

  @ResolveField(() => Project, { nullable: true })
  project(@Parent() contract: Contract): Promise<Project | null> {
    if (!contract.projectId) return Promise.resolve(null);
    return this.contractsService.findProjectByContract(contract.projectId) as Promise<Project | null>;
  }
}
