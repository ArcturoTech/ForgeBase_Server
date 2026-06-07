import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AttachmentsService } from './attachments.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadFile(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto,
  ) {
    if (!file) throw new BadRequestException('Arquivo não enviado');
    const attachment = await this.attachmentsService.createAttachment(user.id, dto, file);
    return {
      id: attachment.id,
      filename: attachment.filename,
      mimeType: attachment.mimeType,
      size: attachment.size,
      url: attachment.url,
      targetType: attachment.targetType,
      targetId: attachment.targetId,
      createdAt: attachment.createdAt,
    };
  }

  @Public()
  @Get(':id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const attachment = await this.attachmentsService.findAttachmentForDownload(id);
    res.redirect(attachment.url);
  }
}
