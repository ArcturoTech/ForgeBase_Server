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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const invoices_service_1 = require("./invoices.service");
const invoice_model_1 = require("./models/invoice.model");
const paginated_invoices_model_1 = require("./models/paginated-invoices.model");
const revenue_summary_model_1 = require("./models/revenue-summary.model");
const create_invoice_input_1 = require("./dto/create-invoice.input");
const mark_invoice_paid_input_1 = require("./dto/mark-invoice-paid.input");
const update_invoice_input_1 = require("./dto/update-invoice.input");
const pagination_input_1 = require("../../common/pagination/pagination.input");
const gql_auth_guard_1 = require("../../common/guards/gql-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let InvoicesResolver = class InvoicesResolver {
    invoicesService;
    constructor(invoicesService) {
        this.invoicesService = invoicesService;
    }
    listInvoices(user, orgId, pagination) {
        return this.invoicesService.listInvoices(user.id, orgId, pagination);
    }
    findInvoiceById(user, id) {
        return this.invoicesService.findInvoiceById(user.id, id);
    }
    findRevenueSummary(user, orgId) {
        return this.invoicesService.findRevenueSummary(user.id, orgId);
    }
    createInvoice(user, input) {
        return this.invoicesService.createInvoice(user.id, input);
    }
    updateInvoice(user, input) {
        return this.invoicesService.updateInvoice(user.id, input);
    }
    removeInvoice(user, id) {
        return this.invoicesService.removeInvoice(user.id, id);
    }
    sendInvoice(user, id) {
        return this.invoicesService.sendInvoice(user.id, id);
    }
    markInvoicePaid(user, input) {
        return this.invoicesService.markInvoicePaidById(user.id, input);
    }
};
exports.InvoicesResolver = InvoicesResolver;
__decorate([
    (0, graphql_1.Query)(() => paginated_invoices_model_1.PaginatedInvoices),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('pagination')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, pagination_input_1.PaginationInput]),
    __metadata("design:returntype", Promise)
], InvoicesResolver.prototype, "listInvoices", null);
__decorate([
    (0, graphql_1.Query)(() => invoice_model_1.Invoice),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvoicesResolver.prototype, "findInvoiceById", null);
__decorate([
    (0, graphql_1.Query)(() => revenue_summary_model_1.RevenueSummary),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvoicesResolver.prototype, "findRevenueSummary", null);
__decorate([
    (0, graphql_1.Mutation)(() => invoice_model_1.Invoice),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_invoice_input_1.CreateInvoiceInput]),
    __metadata("design:returntype", Promise)
], InvoicesResolver.prototype, "createInvoice", null);
__decorate([
    (0, graphql_1.Mutation)(() => invoice_model_1.Invoice),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_invoice_input_1.UpdateInvoiceInput]),
    __metadata("design:returntype", Promise)
], InvoicesResolver.prototype, "updateInvoice", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvoicesResolver.prototype, "removeInvoice", null);
__decorate([
    (0, graphql_1.Mutation)(() => invoice_model_1.Invoice),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvoicesResolver.prototype, "sendInvoice", null);
__decorate([
    (0, graphql_1.Mutation)(() => invoice_model_1.Invoice),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mark_invoice_paid_input_1.MarkInvoicePaidInput]),
    __metadata("design:returntype", Promise)
], InvoicesResolver.prototype, "markInvoicePaid", null);
exports.InvoicesResolver = InvoicesResolver = __decorate([
    (0, graphql_1.Resolver)(() => invoice_model_1.Invoice),
    __metadata("design:paramtypes", [invoices_service_1.InvoicesService])
], InvoicesResolver);
//# sourceMappingURL=invoices.resolver.js.map