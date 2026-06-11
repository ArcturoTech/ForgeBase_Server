import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { StorageService } from '@/common/storage/storage.service';
import { UploadFileDto } from './dto/upload-file.dto';

type UploadedFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

const INTAKE_PENDING_TARGET = 'intake_pending';
const ISSUE_TARGET = 'issue';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
    private readonly storage: StorageService,
  ) {}

  async createAttachment(userId: string, input: UploadFileDto, file: UploadedFile) {
    await this.tenancy.assertOrgMembership(userId, input.orgId);
    const stored = await this.storage.saveFile(file.buffer, file.originalname, input.orgId);
    return this.prisma.attachment.create({
      data: {
        orgId: input.orgId,
        uploaderId: userId,
        targetType: input.targetType,
        targetId: input.targetId,
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: stored.url,
        storageKey: stored.key,
        resourceType: stored.resourceType,
      },
    });
  }

  async createIntakeAttachment(orgId: string, file: UploadedFile) {
    const stored = await this.storage.saveFile(file.buffer, file.originalname, orgId);
    return this.prisma.attachment.create({
      data: {
        orgId,
        uploaderId: null,
        targetType: INTAKE_PENDING_TARGET,
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: stored.url,
        storageKey: stored.key,
        resourceType: stored.resourceType,
      },
    });
  }

  resolvePendingIntakeAttachments(orgId: string, attachmentIds: string[]) {
    return this.prisma.attachment.findMany({
      where: { orgId, id: { in: attachmentIds }, targetType: INTAKE_PENDING_TARGET },
    });
  }

  async linkIntakeAttachmentsToIssue(attachmentIds: string[], issueId: string) {
    await this.prisma.attachment.updateMany({
      where: { id: { in: attachmentIds }, targetType: INTAKE_PENDING_TARGET },
      data: { targetType: ISSUE_TARGET, targetId: issueId },
    });
  }

  async listAttachmentsByTarget(
    userId: string,
    orgId: string,
    targetType: string,
    targetId: string,
  ) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.attachment.findMany({
      where: { orgId, targetType, targetId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async findAttachmentForDownload(id: string) {
    const attachment = await this.prisma.attachment.findUnique({ where: { id } });
    if (!attachment) throw new NotFoundException('Arquivo não encontrado');
    return attachment;
  }

  async removeAttachment(userId: string, id: string) {
    const attachment = await this.findAttachmentForDownload(id);
    await this.tenancy.assertOrgMembership(userId, attachment.orgId);
    await this.storage.removeFile(attachment.storageKey, attachment.resourceType ?? 'image');
    await this.prisma.attachment.delete({ where: { id } });
    return true;
  }
}
