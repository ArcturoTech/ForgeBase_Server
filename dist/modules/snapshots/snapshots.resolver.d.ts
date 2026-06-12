import { SnapshotsService } from './snapshots.service';
import { SprintSnapshot } from './models/sprint-snapshot.model';
import { VelocityPoint } from './models/velocity-point.model';
import { SprintTagSlice } from './models/sprint-tag-slice.model';
import { SprintMemberLoad } from './models/sprint-member-load.model';
import { SprintTypeDistribution } from './models/sprint-type-distribution.model';
import { SprintCompletionRate } from './models/sprint-completion-rate.model';
import { SprintThroughput } from './models/sprint-throughput.model';
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
export declare class SnapshotsResolver {
    private readonly snapshotsService;
    constructor(snapshotsService: SnapshotsService);
    listSprintBurndown(user: AuthenticatedUser, sprintId: string): Promise<SprintSnapshot[]>;
    listSprintVelocity(user: AuthenticatedUser, projectId: string): Promise<VelocityPoint[]>;
    listSprintTagComposition(user: AuthenticatedUser, sprintId: string): Promise<SprintTagSlice[]>;
    listSprintMemberLoad(user: AuthenticatedUser, sprintId: string): Promise<SprintMemberLoad[]>;
    listSprintTypeDistribution(user: AuthenticatedUser, projectId: string, sprintIds?: string[]): Promise<SprintTypeDistribution[]>;
    listSprintCompletionRate(user: AuthenticatedUser, projectId: string): Promise<SprintCompletionRate[]>;
    listSprintThroughput(user: AuthenticatedUser, projectId: string): Promise<SprintThroughput[]>;
}
