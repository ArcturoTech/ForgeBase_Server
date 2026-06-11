import { Module } from '@nestjs/common';
import { IssuesModule } from '@/modules/issues/issues.module';
import { AttachmentsModule } from '@/modules/attachments/attachments.module';
import { IntakeResolver } from './intake.resolver';
import { IntakeUploadController } from './intake-upload.controller';
import { IntakeService } from './intake.service';

@Module({
  imports: [IssuesModule, AttachmentsModule],
  controllers: [IntakeUploadController],
  providers: [IntakeResolver, IntakeService],
})
export class IntakeModule {}
