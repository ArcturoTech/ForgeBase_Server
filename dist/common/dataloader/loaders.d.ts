import DataLoader from 'dataloader';
import { PrismaService } from "../../prisma/prisma.service";
import { User } from "../../users/models/user.model";
import { Label } from "../../modules/issues/models/label.model";
import { Subtask } from "../../modules/issues/models/subtask.model";
import { IssueComment } from "../../modules/issues/models/issue-comment.model";
export interface AppLoaders {
    issueAssignees: DataLoader<string, User[]>;
    issueLabels: DataLoader<string, Label[]>;
    issueSubtasks: DataLoader<string, Subtask[]>;
    issueComments: DataLoader<string, IssueComment[]>;
}
export declare function createLoaders(prisma: PrismaService): AppLoaders;
