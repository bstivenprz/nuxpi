import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ProcessBroadcastEvent } from './process-broadcast.event';
import { InjectQueue } from '@nestjs/bullmq';
import { BROADCAST_QUEUE } from '../chat.module';
import { Queue } from 'bullmq';

@EventsHandler(ProcessBroadcastEvent)
export class ProcessBroadcastEventHandler
  implements IEventHandler<ProcessBroadcastEvent>
{
  private logger = new Logger(ProcessBroadcastEventHandler.name);

  constructor(@InjectQueue(BROADCAST_QUEUE) private queue: Queue) {}

  async handle(event: ProcessBroadcastEvent) {
    try {
      this.logger.log(`Handling event: ${ProcessBroadcastEvent.name}`);
      await this.queue.add('send', event);
    } catch (error) {
      this.logger.error(
        `Error handling event: ${ProcessBroadcastEvent.name}`,
        error,
      );
    } finally {
      this.logger.log(`Handling ${ProcessBroadcastEvent.name} event: Finished`);
    }
  }
}
