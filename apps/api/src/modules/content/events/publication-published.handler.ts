import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { PublicationPublishedEvent } from './publication-published.event';
import { UpdatePublicationScoreCommand } from '../commands/update-publication-score.command';

@EventsHandler(PublicationPublishedEvent)
export class PublicationPublishedEventHandler
  implements IEventHandler<PublicationPublishedEvent>
{
  private logger = new Logger(PublicationPublishedEventHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: PublicationPublishedEvent) {
    try {
      this.logger.log(`Handling event: ${PublicationPublishedEvent.name}`);
      const { publication } = event;

      await this.commandBus.execute(
        new UpdatePublicationScoreCommand(publication),
      );

      this.logger.log(`Publication published: ${publication.id}`);
    } catch (error) {
      this.logger.error(
        `Error handling event: ${PublicationPublishedEvent.name}`,
        error,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
