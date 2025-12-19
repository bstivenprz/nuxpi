import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ReadNotificationCommand } from './read-notification.command';

@CommandHandler(ReadNotificationCommand)
export class ReadNotificationCommandHandler
  implements ICommandHandler<ReadNotificationCommand, void>
{
  constructor() {}

  async execute(command: ReadNotificationCommand): Promise<void> {
    const {} = command;
  }
}
