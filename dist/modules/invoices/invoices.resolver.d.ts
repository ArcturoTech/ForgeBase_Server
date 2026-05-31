import { InvoicesService } from './invoices.service';
import { Invoice } from './models/invoice.model';
import { PaginatedInvoices } from './models/paginated-invoices.model';
import { RevenueSummary } from './models/revenue-summary.model';
import { CreateInvoiceInput } from './dto/create-invoice.input';
import { MarkInvoicePaidInput } from './dto/mark-invoice-paid.input';
import { UpdateInvoiceInput } from './dto/update-invoice.input';
import { PaginationInput } from "../../common/pagination/pagination.input";
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
export declare class InvoicesResolver {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    listInvoices(user: AuthenticatedUser, orgId: string, pagination: PaginationInput): Promise<PaginatedInvoices>;
    findInvoiceById(user: AuthenticatedUser, id: string): Promise<Invoice>;
    findRevenueSummary(user: AuthenticatedUser, orgId: string): Promise<RevenueSummary>;
    createInvoice(user: AuthenticatedUser, input: CreateInvoiceInput): Promise<Invoice>;
    updateInvoice(user: AuthenticatedUser, input: UpdateInvoiceInput): Promise<Invoice>;
    removeInvoice(user: AuthenticatedUser, id: string): Promise<boolean>;
    sendInvoice(user: AuthenticatedUser, id: string): Promise<Invoice>;
    markInvoicePaid(user: AuthenticatedUser, input: MarkInvoicePaidInput): Promise<Invoice>;
}
