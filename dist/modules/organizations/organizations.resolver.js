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
exports.OrganizationsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const organizations_service_1 = require("./organizations.service");
const organization_model_1 = require("./models/organization.model");
const feature_flag_model_1 = require("./models/feature-flag.model");
const paginated_organizations_model_1 = require("./models/paginated-organizations.model");
const paginated_admin_org_rows_model_1 = require("./models/paginated-admin-org-rows.model");
const platform_stats_model_1 = require("./models/platform-stats.model");
const organization_usage_model_1 = require("./models/organization-usage.model");
const create_organization_input_1 = require("./dto/create-organization.input");
const update_organization_input_1 = require("./dto/update-organization.input");
const pagination_input_1 = require("../../common/pagination/pagination.input");
const gql_auth_guard_1 = require("../../common/guards/gql-auth.guard");
const gql_roles_guard_1 = require("../../common/guards/gql-roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const prisma_client_1 = require("../../prisma/prisma-client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const current_org_decorator_1 = require("../../common/decorators/current-org.decorator");
let OrganizationsResolver = class OrganizationsResolver {
    organizationsService;
    constructor(organizationsService) {
        this.organizationsService = organizationsService;
    }
    listMyOrganizations(user) {
        return this.organizationsService.listOrganizationsForUser(user.id);
    }
    findActiveOrganization(user, activeOrgId) {
        return this.organizationsService.findActiveOrganization(user.id, activeOrgId);
    }
    listOrganizations(pagination) {
        return this.organizationsService.listOrganizations(pagination);
    }
    listOrganizationsForAdmin(user, pagination) {
        return this.organizationsService.listOrganizationsForAdmin(user.id, pagination);
    }
    findPlatformStats(user) {
        return this.organizationsService.findPlatformStats(user.id);
    }
    findOrganizationUsage(user, orgId) {
        return this.organizationsService.findOrganizationUsage(user.id, orgId);
    }
    findOrganizationBySlug(user, slug) {
        return this.organizationsService.findOrganizationBySlug(user.id, slug);
    }
    listFeatureFlags(user, orgId) {
        return this.organizationsService.listFeatureFlags(user.id, orgId);
    }
    createOrganization(user, input) {
        return this.organizationsService.createOrganization(user.id, input);
    }
    updateOrganization(user, input) {
        return this.organizationsService.updateOrganization(user.id, input);
    }
    toggleFeatureFlag(user, orgId, key) {
        return this.organizationsService.toggleFeatureFlag(user.id, orgId, key);
    }
};
exports.OrganizationsResolver = OrganizationsResolver;
__decorate([
    (0, graphql_1.Query)(() => [organization_model_1.Organization]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationsResolver.prototype, "listMyOrganizations", null);
__decorate([
    (0, graphql_1.Query)(() => organization_model_1.Organization, { nullable: true }),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, current_org_decorator_1.CurrentOrg)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationsResolver.prototype, "findActiveOrganization", null);
__decorate([
    (0, graphql_1.Query)(() => paginated_organizations_model_1.PaginatedOrganizations),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, gql_roles_guard_1.GqlRolesGuard),
    (0, roles_decorator_1.Roles)(prisma_client_1.Role.SUPERADMIN),
    __param(0, (0, graphql_1.Args)('pagination')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_input_1.PaginationInput]),
    __metadata("design:returntype", Promise)
], OrganizationsResolver.prototype, "listOrganizations", null);
__decorate([
    (0, graphql_1.Query)(() => paginated_admin_org_rows_model_1.PaginatedAdminOrgRows),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, gql_roles_guard_1.GqlRolesGuard),
    (0, roles_decorator_1.Roles)(prisma_client_1.Role.SUPERADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('pagination')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_input_1.PaginationInput]),
    __metadata("design:returntype", Promise)
], OrganizationsResolver.prototype, "listOrganizationsForAdmin", null);
__decorate([
    (0, graphql_1.Query)(() => platform_stats_model_1.PlatformStats),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, gql_roles_guard_1.GqlRolesGuard),
    (0, roles_decorator_1.Roles)(prisma_client_1.Role.SUPERADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationsResolver.prototype, "findPlatformStats", null);
__decorate([
    (0, graphql_1.Query)(() => organization_usage_model_1.OrganizationUsage),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrganizationsResolver.prototype, "findOrganizationUsage", null);
__decorate([
    (0, graphql_1.Query)(() => organization_model_1.Organization),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrganizationsResolver.prototype, "findOrganizationBySlug", null);
__decorate([
    (0, graphql_1.Query)(() => [feature_flag_model_1.FeatureFlag]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrganizationsResolver.prototype, "listFeatureFlags", null);
__decorate([
    (0, graphql_1.Mutation)(() => organization_model_1.Organization),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, gql_roles_guard_1.GqlRolesGuard),
    (0, roles_decorator_1.Roles)(prisma_client_1.Role.SUPERADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_organization_input_1.CreateOrganizationInput]),
    __metadata("design:returntype", Promise)
], OrganizationsResolver.prototype, "createOrganization", null);
__decorate([
    (0, graphql_1.Mutation)(() => organization_model_1.Organization),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_organization_input_1.UpdateOrganizationInput]),
    __metadata("design:returntype", Promise)
], OrganizationsResolver.prototype, "updateOrganization", null);
__decorate([
    (0, graphql_1.Mutation)(() => feature_flag_model_1.FeatureFlag),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], OrganizationsResolver.prototype, "toggleFeatureFlag", null);
exports.OrganizationsResolver = OrganizationsResolver = __decorate([
    (0, graphql_1.Resolver)(() => organization_model_1.Organization),
    __metadata("design:paramtypes", [organizations_service_1.OrganizationsService])
], OrganizationsResolver);
//# sourceMappingURL=organizations.resolver.js.map