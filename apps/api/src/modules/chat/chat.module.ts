import { DynamicModule, Module } from '@nestjs/common';
import { join } from 'path';

import { DynamicProviderInjection } from '@/common/utils/dynamic-provider-injection.provider';
import { ConversationController } from './controllers/conversation.controller';
import { ChatMapper } from './chat.mapper';
import { ChatWebSocket } from './chat.websocket';

@Module({})
export class ChatModule {
  static forRoot(): DynamicModule {
    const handlers = DynamicProviderInjection.injectHandlers(
      join(__dirname, './'),
    );

    return {
      module: ChatModule,
      controllers: [ConversationController],
      providers: [ChatMapper, ChatWebSocket, ...handlers],
    };
  }
}
