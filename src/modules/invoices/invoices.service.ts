import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { InvoiceStatus } from '@/common/graphql/enums';
import { PaginationInput } from '@/common/pagination/pagination.input';
import { PaginatedInterface } from '@/common/pagination/paginated.type';
import { Invoice } from './models/invoice.model';
import { RevenueSummary } from './models/revenue-summary.model';
import { CreateInvoiceInput } from './dto/create-invoice.input';
import { MarkInvoicePaidInput } from './dto/mark-invoice-paid.input';
import { UpdateInvoiceInput } from './dto/update-invoice.input';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

  async listInvoices(
    userId: string,
    orgId: string,
    pagination: PaginationInput,
  ): Promise<PaginatedInterface<Invoice>> {
    await this.tenancy.assertOrgMembership(userId, orgId);
    const { page, limit, search } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      orgId,
      ...(search
        ? {
            OR: [
              { clientName: { contains: search, mode: 'insensitive' as const } },
              { number: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return {
      data: data as Invoice[],
      total,
      page,
      limit,
      hasNextPage: page * limit < total,
    };
  }

  async findInvoiceById(userId: string, id: string) {
    const invoice = await this.loadInvoiceOrThrow(id);
    await this.tenancy.assertOrgMembership(userId, invoice.orgId);
    return invoice;
  }

  async findRevenueSummary(userId: string, orgId: string): Promise<RevenueSummary> {
    await this.tenancy.assertOrgMembership(userId, orgId);
    const [receivable, overdue, received] = await this.prisma.$transaction([
      this.prisma.invoice.aggregate({
        where: { orgId, status: InvoiceStatus.SENT },
        _sum: { amountCents: true },
      }),
      this.prisma.invoice.aggregate({
        where: { orgId, status: InvoiceStatus.OVERDUE },
        _sum: { amountCents: true },
      }),
      this.prisma.invoice.aggregate({
        where: { orgId, status: InvoiceStatus.PAID },
        _sum: { amountCents: true },
      }),
    ]);

    const organization = await this.prisma.organization.findUnique({ where: { id: orgId } });

    return {
      mrrCents: organization?.mrrCents ?? 0,
      receivableCents: receivable._sum.amountCents ?? 0,
      overdueCents: overdue._sum.amountCents ?? 0,
      receivedCents: received._sum.amountCents ?? 0,
    };
  }

  async createInvoice(userId: string, input: CreateInvoiceInput) {
    await this.tenancy.assertOrgMembership(userId, input.orgId);
    return this.prisma.invoice.create({
      data: {
        orgId: input.orgId,
        projectId: input.projectId,
        number: input.number,
        clientName: input.clientName,
        amountCents: input.amountCents,
        issueDate: input.issueDate,
        dueDate: input.dueDate,
        status: input.status,
      },
    });
  }

  async updateInvoice(userId: string, input: UpdateInvoiceInput) {
    const invoice = await this.loadInvoiceOrThrow(input.id);
    await this.tenancy.assertOrgMembership(userId, invoice.orgId);
    const { id, ...rest } = input;
    return this.prisma.invoice.update({
      where: { id },
      data: rest,
    });
  }

  async removeInvoice(userId: string, id: string) {
    const invoice = await this.loadInvoiceOrThrow(id);
    await this.tenancy.assertOrgMembership(userId, invoice.orgId);
    await this.prisma.invoice.delete({ where: { id } });
    return true;
  }

  async sendInvoice(userId: string, id: string) {
    const invoice = await this.loadInvoiceOrThrow(id);
    await this.tenancy.assertOrgMembership(userId, invoice.orgId);
    return this.prisma.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.SENT },
    });
  }

  async markInvoicePaidById(userId: string, input: MarkInvoicePaidInput) {
    const invoice = await this.loadInvoiceOrThrow(input.id);
    await this.tenancy.assertOrgMembership(userId, invoice.orgId);
    return this.prisma.invoice.update({
      where: { id: input.id },
      data: { status: InvoiceStatus.PAID, paidAt: input.paidAt ?? new Date() },
    });
  }

  private async loadInvoiceOrThrow(id: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new NotFoundException('Fatura não encontrada');
    return invoice;
  }
}
