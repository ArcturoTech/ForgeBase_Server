import { Module } from '@nestjs/common';
import { IssuesResolver } from './issues.resolver';
import { IssuesService } from './issues.service';
import { ActivityModule } from '@/modules/activity/activity.module';

@Module({
  imports: [ActivityModule],
  providers: [IssuesResolver, IssuesService],
  exports: [IssuesService],
})
export class IssuesModule {}
