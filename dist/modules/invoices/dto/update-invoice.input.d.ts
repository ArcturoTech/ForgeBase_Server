import { CreateInvoiceInput } from './create-invoice.input';
declare const UpdateInvoiceInput_base: import("@nestjs/common").Type<Partial<Omit<CreateInvoiceInput, "number" | "orgId">>>;
export declare class UpdateInvoiceInput extends UpdateInvoiceInput_base {
    id: string;
}
export {};
