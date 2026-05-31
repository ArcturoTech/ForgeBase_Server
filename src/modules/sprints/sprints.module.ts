import { Module } from '@nestjs/common';
import { SprintsResolver } from './sprints.resolver';
import { SprintsService } from './sprints.service';
import { IssuesModule } from '@/modules/issues/issues.module';

@Module({
  imports: [IssuesModule],
  providers: [SprintsResolver, SprintsService],
  exports: [SprintsService],
})
export class SprintsModule {}
