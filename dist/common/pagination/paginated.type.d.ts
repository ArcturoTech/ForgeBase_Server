import { Type } from '@nestjs/common';
export interface PaginatedInterface<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
}
export declare function Paginated<T>(classRef: Type<T>): Type<PaginatedInterface<T>>;
