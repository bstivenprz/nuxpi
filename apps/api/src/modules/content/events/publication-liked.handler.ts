import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { PublicationLikedEvent } from './publication-liked.event';
import { UpdatePublicationScoreCommand } from '../commands/update-publication-score.command';

@EventsHandler(PublicationLikedEvent)
export class PublicationLikedEventHandler
  implements IEventHandler<PublicationLikedEvent>
{
  private logger = new Logger(PublicationLikedEventHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: PublicationLikedEvent) {
    try {
      this.logger.log(`Handling event: ${PublicationLikedEvent.name}`);
      const { publication } = event;

      await this.commandBus.execute(
        new UpdatePublicationScoreCommand(publication),
      );

      this.logger.log(`Publication liked: ${publication.id}`);
    } catch (error) {
      this.logger.error(
        `Error handling event: ${PublicationLikedEvent.name}`,
        error,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
