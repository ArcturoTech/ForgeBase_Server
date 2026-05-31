import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@/common/pagination/paginated.type';
import { Contract } from './contract.model';

@ObjectType()
export class PaginatedContracts extends Paginated(Contract) {}
