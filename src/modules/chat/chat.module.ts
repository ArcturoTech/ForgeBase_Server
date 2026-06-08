import { forwardRef, Module } from '@nestjs/common';
import { ChatSpacesModule } from '@/modules/chat-spaces/chat-spaces.module';
import { ChatResolver } from './chat.resolver';
import { MessageResolver } from './message.resolver';
import { ChatService } from './chat.service';

@Module({
  imports: [forwardRef(() => ChatSpacesModule)],
  providers: [ChatResolver, MessageResolver, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
