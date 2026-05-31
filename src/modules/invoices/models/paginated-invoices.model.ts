import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@/common/pagination/paginated.type';
import { Invoice } from './invoice.model';

@ObjectType()
export class PaginatedInvoices extends Paginated(Invoice) {}
