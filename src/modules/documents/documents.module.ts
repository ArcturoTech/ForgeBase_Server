import { Module } from '@nestjs/common';
import { DocumentsResolver, DocumentCommentResolver } from './documents.resolver';
import { DocumentsService } from './documents.service';
import { NotificationsModule } from '@/modules/notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [DocumentsResolver, DocumentCommentResolver, DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
