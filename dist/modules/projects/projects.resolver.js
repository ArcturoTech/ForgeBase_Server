"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectMemberResolver = exports.ProjectsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
const project_model_1 = require("./models/project.model");
const milestone_model_1 = require("./models/milestone.model");
const project_member_model_1 = require("./models/project-member.model");
const create_project_input_1 = require("./dto/create-project.input");
const update_project_input_1 = require("./dto/update-project.input");
const add_project_member_input_1 = require("./dto/add-project-member.input");
const update_project_member_input_1 = require("./dto/update-project-member.input");
const remove_project_member_input_1 = require("./dto/remove-project-member.input");
const user_model_1 = require("../../users/models/user.model");
const gql_auth_guard_1 = require("../../common/guards/gql-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ProjectsResolver = class ProjectsResolver {
    projectsService;
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    listProjects(user, orgId) {
        return this.projectsService.listProjects(user.id, orgId);
    }
    findProjectById(user, id) {
        return this.projectsService.findProjectById(user.id, id);
    }
    listProjectMilestones(user, projectId) {
        return this.projectsService.listMilestonesByProject(user.id, projectId);
    }
    createProject(user, input) {
        return this.projectsService.createProject(user.id, input);
    }
    updateProject(user, input) {
        return this.projectsService.updateProject(user.id, input);
    }
    removeProject(user, id) {
        return this.projectsService.removeProject(user.id, id);
    }
    listProjectMembers(user, projectId) {
        return this.projectsService.listProjectMembers(user.id, projectId);
    }
    addProjectMember(user, input) {
        return this.projectsService.addProjectMember(user.id, input);
    }
    updateProjectMember(user, input) {
        return this.projectsService.updateProjectMember(user.id, input);
    }
    removeProjectMember(user, input) {
        return this.projectsService.removeProjectMember(user.id, input);
    }
    members(project) {
        if (project.members)
            return Promise.resolve(project.members);
        return this.projectsService.listMembersByProject(project.id);
    }
    sprintCount(project) {
        return this.projectsService.countSprintsByProject(project.id);
    }
};
exports.ProjectsResolver = ProjectsResolver;
__decorate([
    (0, graphql_1.Query)(() => [project_model_1.Project]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orgId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProjectsResolver.prototype, "listProjects", null);
__decorate([
    (0, graphql_1.Query)(() => project_model_1.Project),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProjectsResolver.prototype, "findProjectById", null);
__decorate([
    (0, graphql_1.Query)(() => [milestone_model_1.Milestone]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('projectId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProjectsResolver.prototype, "listProjectMilestones", null);
__decorate([
    (0, graphql_1.Mutation)(() => project_model_1.Project),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_project_input_1.CreateProjectInput]),
    __metadata("design:returntype", Promise)
], ProjectsResolver.prototype, "createProject", null);
__decorate([
    (0, graphql_1.Mutation)(() => project_model_1.Project),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_project_input_1.UpdateProjectInput]),
    __metadata("design:returntype", Promise)
], ProjectsResolver.prototype, "updateProject", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProjectsResolver.prototype, "removeProject", null);
__decorate([
    (0, graphql_1.Query)(() => [project_member_model_1.ProjectMember]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('projectId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProjectsResolver.prototype, "listProjectMembers", null);
__decorate([
    (0, graphql_1.Mutation)(() => project_member_model_1.ProjectMember),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_project_member_input_1.AddProjectMemberInput]),
    __metadata("design:returntype", Promise)
], ProjectsResolver.prototype, "addProjectMember", null);
__decorate([
    (0, graphql_1.Mutation)(() => project_member_model_1.ProjectMember),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_project_member_input_1.UpdateProjectMemberInput]),
    __metadata("design:returntype", Promise)
], ProjectsResolver.prototype, "updateProjectMember", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, remove_project_member_input_1.RemoveProjectMemberInput]),
    __metadata("design:returntype", Promise)
], ProjectsResolver.prototype, "removeProjectMember", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [project_member_model_1.ProjectMember]),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_model_1.Project]),
    __metadata("design:returntype", Promise)
], ProjectsResolver.prototype, "members", null);
__decorate([
    (0, graphql_1.ResolveField)(() => graphql_1.Int),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_model_1.Project]),
    __metadata("design:returntype", Promise)
], ProjectsResolver.prototype, "sprintCount", null);
exports.ProjectsResolver = ProjectsResolver = __decorate([
    (0, graphql_1.Resolver)(() => project_model_1.Project),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsResolver);
let ProjectMemberResolver = class ProjectMemberResolver {
    projectsService;
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    user(member) {
        if (member.user)
            return Promise.resolve(member.user);
        return this.projectsService.findUserByProjectMember(member.userId);
    }
};
exports.ProjectMemberResolver = ProjectMemberResolver;
__decorate([
    (0, graphql_1.ResolveField)(() => user_model_1.User),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_member_model_1.ProjectMember]),
    __metadata("design:returntype", Promise)
], ProjectMemberResolver.prototype, "user", null);
exports.ProjectMemberResolver = ProjectMemberResolver = __decorate([
    (0, graphql_1.Resolver)(() => project_member_model_1.ProjectMember),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectMemberResolver);
//# sourceMappingURL=projects.resolver.js.map