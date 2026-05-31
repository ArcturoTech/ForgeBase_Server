"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const tenancy_service_1 = require("../../common/tenancy/tenancy.service");
const enums_1 = require("../../common/graphql/enums");
let InvoicesService = class InvoicesService {
    prisma;
    tenancy;
    constructor(prisma, tenancy) {
        this.prisma = prisma;
        this.tenancy = tenancy;
    }
    async listInvoices(userId, orgId, pagination) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        const { page, limit, search } = pagination;
        const skip = (page - 1) * limit;
        const where = {
            orgId,
            ...(search
                ? {
                    OR: [
                        { clientName: { contains: search, mode: 'insensitive' } },
                        { number: { contains: search, mode: 'insensitive' } },
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
            data: data,
            total,
            page,
            limit,
            hasNextPage: page * limit < total,
        };
    }
    async findInvoiceById(userId, id) {
        const invoice = await this.loadInvoiceOrThrow(id);
        await this.tenancy.assertOrgMembership(userId, invoice.orgId);
        return invoice;
    }
    async findRevenueSummary(userId, orgId) {
        await this.tenancy.assertOrgMembership(userId, orgId);
        const [receivable, overdue, received] = await this.prisma.$transaction([
            this.prisma.invoice.aggregate({
                where: { orgId, status: enums_1.InvoiceStatus.SENT },
                _sum: { amountCents: true },
            }),
            this.prisma.invoice.aggregate({
                where: { orgId, status: enums_1.InvoiceStatus.OVERDUE },
                _sum: { amountCents: true },
            }),
            this.prisma.invoice.aggregate({
                where: { orgId, status: enums_1.InvoiceStatus.PAID },
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
    async createInvoice(userId, input) {
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
    async updateInvoice(userId, input) {
        const invoice = await this.loadInvoiceOrThrow(input.id);
        await this.tenancy.assertOrgMembership(userId, invoice.orgId);
        const { id, ...rest } = input;
        return this.prisma.invoice.update({
            where: { id },
            data: rest,
        });
    }
    async removeInvoice(userId, id) {
        const invoice = await this.loadInvoiceOrThrow(id);
        await this.tenancy.assertOrgMembership(userId, invoice.orgId);
        await this.prisma.invoice.delete({ where: { id } });
        return true;
    }
    async sendInvoice(userId, id) {
        const invoice = await this.loadInvoiceOrThrow(id);
        await this.tenancy.assertOrgMembership(userId, invoice.orgId);
        return this.prisma.invoice.update({
            where: { id },
            data: { status: enums_1.InvoiceStatus.SENT },
        });
    }
    async markInvoicePaidById(userId, input) {
        const invoice = await this.loadInvoiceOrThrow(input.id);
        await this.tenancy.assertOrgMembership(userId, invoice.orgId);
        return this.prisma.invoice.update({
            where: { id: input.id },
            data: { status: enums_1.InvoiceStatus.PAID, paidAt: input.paidAt ?? new Date() },
        });
    }
    async loadInvoiceOrThrow(id) {
        const invoice = await this.prisma.invoice.findUnique({ where: { id } });
        if (!invoice)
            throw new common_1.NotFoundException('Fatura não encontrada');
        return invoice;
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenancy_service_1.TenancyService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map