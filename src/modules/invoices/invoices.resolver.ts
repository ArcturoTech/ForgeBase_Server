import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Invoice } from './models/invoice.model';
import { PaginatedInvoices } from './models/paginated-invoices.model';
import { RevenueSummary } from './models/revenue-summary.model';
import { CreateInvoiceInput } from './dto/create-invoice.input';
import { MarkInvoicePaidInput } from './dto/mark-invoice-paid.input';
import { UpdateInvoiceInput } from './dto/update-invoice.input';
import { PaginationInput } from '@/common/pagination/pagination.input';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver(() => Invoice)
export class InvoicesResolver {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Query(() => PaginatedInvoices)
  @UseGuards(GqlAuthGuard)
  listInvoices(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
    @Args('pagination') pagination: PaginationInput,
  ): Promise<PaginatedInvoices> {
    return this.invoicesService.listInvoices(
      user.id,
      orgId,
      pagination,
    ) as Promise<PaginatedInvoices>;
  }

  @Query(() => Invoice)
  @UseGuards(GqlAuthGuard)
  findInvoiceById(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Invoice> {
    return this.invoicesService.findInvoiceById(user.id, id) as Promise<Invoice>;
  }

  @Query(() => RevenueSummary)
  @UseGuards(GqlAuthGuard)
  findRevenueSummary(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
  ): Promise<RevenueSummary> {
    return this.invoicesService.findRevenueSummary(user.id, orgId);
  }

  @Mutation(() => Invoice)
  @UseGuards(GqlAuthGuard)
  createInvoice(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateInvoiceInput,
  ): Promise<Invoice> {
    return this.invoicesService.createInvoice(user.id, input) as Promise<Invoice>;
  }

  @Mutation(() => Invoice)
  @UseGuards(GqlAuthGuard)
  updateInvoice(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: UpdateInvoiceInput,
  ): Promise<Invoice> {
    return this.invoicesService.updateInvoice(user.id, input) as Promise<Invoice>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeInvoice(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.invoicesService.removeInvoice(user.id, id);
  }

  @Mutation(() => Invoice)
  @UseGuards(GqlAuthGuard)
  sendInvoice(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Invoice> {
    return this.invoicesService.sendInvoice(user.id, id) as Promise<Invoice>;
  }

  @Mutation(() => Invoice)
  @UseGuards(GqlAuthGuard)
  markInvoicePaid(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: MarkInvoicePaidInput,
  ): Promise<Invoice> {
    return this.invoicesService.markInvoicePaidById(user.id, input) as Promise<Invoice>;
  }
}
