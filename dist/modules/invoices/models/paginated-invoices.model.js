"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedInvoices = void 0;
const graphql_1 = require("@nestjs/graphql");
const paginated_type_1 = require("../../../common/pagination/paginated.type");
const invoice_model_1 = require("./invoice.model");
let PaginatedInvoices = class PaginatedInvoices extends (0, paginated_type_1.Paginated)(invoice_model_1.Invoice) {
};
exports.PaginatedInvoices = PaginatedInvoices;
exports.PaginatedInvoices = PaginatedInvoices = __decorate([
    (0, graphql_1.ObjectType)()
], PaginatedInvoices);
//# sourceMappingURL=paginated-invoices.model.js.map