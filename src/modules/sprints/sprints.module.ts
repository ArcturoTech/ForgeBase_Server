import { Module } from '@nestjs/common';
import { SprintsResolver } from './sprints.resolver';
import { SprintsService } from './sprints.service';
import { IssuesModule } from '@/modules/issues/issues.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';

@Module({
  imports: [IssuesModule, NotificationsModule],
  providers: [SprintsResolver, SprintsService],
  exports: [SprintsService],
})
export class SprintsModule {}
