import { OrganizationsService } from './organizations.service';
import { Organization } from './models/organization.model';
import { FeatureFlag } from './models/feature-flag.model';
import { PaginatedOrganizations } from './models/paginated-organizations.model';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { PaginationInput } from "../../common/pagination/pagination.input";
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
export declare class OrganizationsResolver {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    listMyOrganizations(user: AuthenticatedUser): Promise<Organization[]>;
    listOrganizations(pagination: PaginationInput): Promise<PaginatedOrganizations>;
    findOrganizationBySlug(user: AuthenticatedUser, slug: string): Promise<Organization>;
    listFeatureFlags(user: AuthenticatedUser, orgId: string): Promise<FeatureFlag[]>;
    createOrganization(input: CreateOrganizationInput): Promise<Organization>;
    updateOrganization(user: AuthenticatedUser, input: UpdateOrganizationInput): Promise<Organization>;
    toggleFeatureFlag(user: AuthenticatedUser, orgId: string, key: string): Promise<FeatureFlag>;
}
