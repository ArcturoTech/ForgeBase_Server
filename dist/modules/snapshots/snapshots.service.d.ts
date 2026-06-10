import { PrismaService } from "../../prisma/prisma.service";
import { TenancyService } from "../../common/tenancy/tenancy.service";
export declare class SnapshotsService {
    private readonly prisma;
    private readonly tenancy;
    constructor(prisma: PrismaService, tenancy: TenancyService);
    captureActiveSprintSnapshots(): Promise<number>;
    listSnapshotsBySprint(userId: string, sprintId: string): Promise<{
        id: string;
        totalPoints: number;
        sprintId: string;
        capturedOn: Date;
        remainingPoints: number;
    }[]>;
    private loadSprintForAccess;
    listSprintTagComposition(userId: string, sprintId: string): Promise<{
        tag: string;
        points: number;
        issues: number;
    }[]>;
    listSprintMemberLoad(userId: string, sprintId: string): Promise<{
        name: string;
        done: number;
        doing: number;
        capacity: number;
    }[]>;
    listVelocityByProject(userId: string, projectId: string): Promise<{
        sprintNumber: number;
        label: string;
        planned: number;
        done: number;
    }[]>;
}
