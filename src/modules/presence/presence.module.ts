import { Module } from '@nestjs/common';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { PresenceResolver } from './presence.resolver';
import { PresenceService } from './presence.service';

@Module({
  imports: [NotificationsModule],
  providers: [PresenceResolver, PresenceService],
  exports: [PresenceService],
})
export class PresenceModule {}
