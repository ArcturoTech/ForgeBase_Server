"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedOrganizations = void 0;
const graphql_1 = require("@nestjs/graphql");
const paginated_type_1 = require("../../../common/pagination/paginated.type");
const organization_model_1 = require("./organization.model");
let PaginatedOrganizations = class PaginatedOrganizations extends (0, paginated_type_1.Paginated)(organization_model_1.Organization) {
};
exports.PaginatedOrganizations = PaginatedOrganizations;
exports.PaginatedOrganizations = PaginatedOrganizations = __decorate([
    (0, graphql_1.ObjectType)()
], PaginatedOrganizations);
//# sourceMappingURL=paginated-organizations.model.js.map