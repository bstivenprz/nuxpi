import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ReadAllNotificationsCommand } from './read-all-notifications.command';

@CommandHandler(ReadAllNotificationsCommand)
export class ReadAllNotificationsCommandHandler
  implements ICommandHandler<ReadAllNotificationsCommand, void>
{
  constructor() {}

  async execute(command: ReadAllNotificationsCommand): Promise<void> {
    const {} = command;
  }
}
