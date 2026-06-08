import { forwardRef, Module } from '@nestjs/common';
import { ChatModule } from '@/modules/chat/chat.module';
import { ChatSpacesResolver } from './chat-spaces.resolver';
import { ChatSpacesService } from './chat-spaces.service';

@Module({
  imports: [forwardRef(() => ChatModule)],
  providers: [ChatSpacesResolver, ChatSpacesService],
  exports: [ChatSpacesService],
})
export class ChatSpacesModule {}
