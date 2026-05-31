"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedContracts = void 0;
const graphql_1 = require("@nestjs/graphql");
const paginated_type_1 = require("../../../common/pagination/paginated.type");
const contract_model_1 = require("./contract.model");
let PaginatedContracts = class PaginatedContracts extends (0, paginated_type_1.Paginated)(contract_model_1.Contract) {
};
exports.PaginatedContracts = PaginatedContracts;
exports.PaginatedContracts = PaginatedContracts = __decorate([
    (0, graphql_1.ObjectType)()
], PaginatedContracts);
//# sourceMappingURL=paginated-contracts.model.js.map