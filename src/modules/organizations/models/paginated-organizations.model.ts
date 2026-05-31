import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@/common/pagination/paginated.type';
import { Organization } from './organization.model';

@ObjectType()
export class PaginatedOrganizations extends Paginated(Organization) {}
