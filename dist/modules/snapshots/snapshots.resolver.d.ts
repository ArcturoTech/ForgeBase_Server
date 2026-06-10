import { SnapshotsService } from './snapshots.service';
import { SprintSnapshot } from './models/sprint-snapshot.model';
import { VelocityPoint } from './models/velocity-point.model';
import { SprintTagSlice } from './models/sprint-tag-slice.model';
import { SprintMemberLoad } from './models/sprint-member-load.model';
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
export declare class SnapshotsResolver {
    private readonly snapshotsService;
    constructor(snapshotsService: SnapshotsService);
    listSprintBurndown(user: AuthenticatedUser, sprintId: string): Promise<SprintSnapshot[]>;
    listSprintVelocity(user: AuthenticatedUser, projectId: string): Promise<VelocityPoint[]>;
    listSprintTagComposition(user: AuthenticatedUser, sprintId: string): Promise<SprintTagSlice[]>;
    listSprintMemberLoad(user: AuthenticatedUser, sprintId: string): Promise<SprintMemberLoad[]>;
}
