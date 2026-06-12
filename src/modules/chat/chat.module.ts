import { forwardRef, Module } from '@nestjs/common';
import { ChatSpacesModule } from '@/modules/chat-spaces/chat-spaces.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { PresenceModule } from '@/modules/presence/presence.module';
import { ChatResolver } from './chat.resolver';
import { MessageResolver } from './message.resolver';
import { ChatService } from './chat.service';

@Module({
  imports: [forwardRef(() => ChatSpacesModule), NotificationsModule, PresenceModule],
  providers: [ChatResolver, MessageResolver, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
