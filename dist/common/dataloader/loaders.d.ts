import DataLoader from 'dataloader';
import { PrismaService } from "../../prisma/prisma.service";
import { User } from "../../users/models/user.model";
import { Label } from "../../modules/issues/models/label.model";
import { Subtask } from "../../modules/issues/models/subtask.model";
import { IssueComment } from "../../modules/issues/models/issue-comment.model";
import { ReactionGroup } from "../../modules/chat/models/reaction-group.model";
import { Attachment } from "../../modules/attachments/models/attachment.model";
import { Message } from "../../modules/chat/models/message.model";
export interface AppLoaders {
    issueAssignees: DataLoader<string, User[]>;
    issueLabels: DataLoader<string, Label[]>;
    issueSubtasks: DataLoader<string, Subtask[]>;
    issueComments: DataLoader<string, IssueComment[]>;
    messageReactions: DataLoader<string, ReactionGroup[]>;
    messageAttachments: DataLoader<string, Attachment[]>;
    messageById: DataLoader<string, Message | null>;
}
export declare function createLoaders(prisma: PrismaService, currentUserId?: string | null): AppLoaders;
