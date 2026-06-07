import { Module } from '@nestjs/common';
import { AttachmentsResolver } from './attachments.resolver';
import { AttachmentsService } from './attachments.service';
import { FilesController } from './files.controller';

@Module({
  controllers: [FilesController],
  providers: [AttachmentsResolver, AttachmentsService],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
