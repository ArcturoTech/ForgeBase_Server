import { ProjectsService } from './projects.service';
import { Project } from './models/project.model';
import { Milestone } from './models/milestone.model';
import { ProjectMember } from './models/project-member.model';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { User } from "../../users/models/user.model";
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
export declare class ProjectsResolver {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    listProjects(user: AuthenticatedUser, orgId: string): Promise<Project[]>;
    findProjectById(user: AuthenticatedUser, id: string): Promise<Project>;
    listProjectMilestones(user: AuthenticatedUser, projectId: string): Promise<Milestone[]>;
    createProject(user: AuthenticatedUser, input: CreateProjectInput): Promise<Project>;
    updateProject(user: AuthenticatedUser, input: UpdateProjectInput): Promise<Project>;
    removeProject(user: AuthenticatedUser, id: string): Promise<boolean>;
    members(project: Project): Promise<ProjectMember[]>;
    sprintCount(project: Project): Promise<number>;
}
export declare class ProjectMemberResolver {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    user(member: ProjectMember): Promise<User>;
}
