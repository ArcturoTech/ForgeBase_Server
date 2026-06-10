import { Module } from '@nestjs/common';
import { IssuesModule } from '@/modules/issues/issues.module';
import { IntakeResolver } from './intake.resolver';
import { IntakeService } from './intake.service';

@Module({
  imports: [IssuesModule],
  providers: [IntakeResolver, IntakeService],
})
export class IntakeModule {}
