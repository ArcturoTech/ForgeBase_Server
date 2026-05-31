import { Column } from './column.model';
export declare class Board {
    id: string;
    projectId: string;
    name: string;
    createdAt: Date;
    columns?: Column[];
}
