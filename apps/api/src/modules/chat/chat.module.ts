import { DynamicModule, Module } from '@nestjs/common';
import { join } from 'path';

import { DynamicProviderInjection } from '@/common/utils/dynamic-provider-injection.provider';
import { ConversationController } from './controllers/conversation.controller';
import { ChatMapper } from './chat.mapper';
import { ChatWebSocket } from './chat.websocket';
import { InboxController } from './controllers/inbox.controller';
import { BullModule } from '@nestjs/bull';
import { BroadcastController } from './controllers/broadcast.controller';
import { BroadcastsQueueProcessor } from './broadcasts.processor';

export const BROADCAST_QUEUE = 'broadcasts' as const;

@Module({})
export class ChatModule {
  static forRoot(): DynamicModule {
    const handlers = DynamicProviderInjection.injectHandlers(
      join(__dirname, './'),
    );

    return {
      module: ChatModule,
      imports: [
        BullModule.registerQueue({
          name: 'broadcasts',
        }),
      ],
      controllers: [
        InboxController,
        ConversationController,
        BroadcastController,
      ],
      providers: [
        ChatMapper,
        ChatWebSocket,
        BroadcastsQueueProcessor,
        ...handlers,
      ],
    };
  }
}
