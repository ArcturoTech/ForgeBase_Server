import { Module } from '@nestjs/common';
import { IssuesResolver } from './issues.resolver';
import { IssuesService } from './issues.service';
import { ActivityModule } from '@/modules/activity/activity.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';

@Module({
  imports: [ActivityModule, NotificationsModule],
  providers: [IssuesResolver, IssuesService],
  exports: [IssuesService],
})
export class IssuesModule {}
