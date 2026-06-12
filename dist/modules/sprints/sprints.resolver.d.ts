import { SprintsService } from './sprints.service';
import { IssuesService } from "../issues/issues.service";
import { Sprint } from './models/sprint.model';
import { SprintSummary } from './models/sprint-summary.model';
import { Issue } from "../issues/models/issue.model";
import { CreateSprintInput } from './dto/create-sprint.input';
import { UpdateSprintInput } from './dto/update-sprint.input';
import { CloseSprintWithOptionsInput } from './dto/close-sprint-with-options.input';
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
export declare class SprintsResolver {
    private readonly sprintsService;
    private readonly issuesService;
    constructor(sprintsService: SprintsService, issuesService: IssuesService);
    listSprintsByProject(user: AuthenticatedUser, projectId: string): Promise<Sprint[]>;
    findActiveSprintSummary(user: AuthenticatedUser, orgId: string): Promise<SprintSummary | null>;
    findSprintById(user: AuthenticatedUser, id: string): Promise<Sprint>;
    createSprint(user: AuthenticatedUser, input: CreateSprintInput): Promise<Sprint>;
    updateSprint(user: AuthenticatedUser, input: UpdateSprintInput): Promise<Sprint>;
    removeSprint(user: AuthenticatedUser, id: string): Promise<boolean>;
    startSprint(user: AuthenticatedUser, id: string): Promise<Sprint>;
    closeSprint(user: AuthenticatedUser, id: string): Promise<Sprint>;
    getSprintRemainingCount(user: AuthenticatedUser, id: string): Promise<number>;
    closeSprintWithOptions(user: AuthenticatedUser, input: CloseSprintWithOptionsInput): Promise<Sprint>;
    restartSprint(user: AuthenticatedUser, id: string): Promise<Sprint>;
    issues(sprint: Sprint): Promise<Issue[]>;
}
