import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@/common/pagination/paginated.type';
import { AdminOrgRow } from './admin-org-row.model';

@ObjectType()
export class PaginatedAdminOrgRows extends Paginated(AdminOrgRow) {}
