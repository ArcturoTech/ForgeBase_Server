import { Module } from '@nestjs/common';
import { DocumentsResolver, DocumentCommentResolver } from './documents.resolver';
import { DocumentsService } from './documents.service';

@Module({
  providers: [DocumentsResolver, DocumentCommentResolver, DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
