import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '@/auth/decorators/public.decorator';
import { AttachmentsService } from '@/modules/attachments/attachments.service';
import { IntakeService } from './intake.service';

const MAX_INTAKE_FILE_BYTES = 10 * 1024 * 1024;

@ApiTags('Intake')
@Controller('intake')
export class IntakeUploadController {
  constructor(
    private readonly intake: IntakeService,
    private readonly attachments: AttachmentsService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_INTAKE_FILE_BYTES } }))
  async uploadIntakeFile(
    @Body('token') token: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!token) throw new BadRequestException('Token ausente');
    if (!file) throw new BadRequestException('Arquivo não enviado');
    const orgId = await this.intake.resolveActiveFormOrgId(token);
    const attachment = await this.attachments.createIntakeAttachment(orgId, file);
    return {
      id: attachment.id,
      filename: attachment.filename,
      mimeType: attachment.mimeType,
      size: attachment.size,
      url: attachment.url,
    };
  }
}
