import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UnsendOutcomingBroadcastCommand } from './unsend-outcoming-broadcast.command';

@CommandHandler(UnsendOutcomingBroadcastCommand)
export class UnsendOutcomingBroadcastCommandHandler implements ICommandHandler<UnsendOutcomingBroadcastCommand, void> {
  constructor() {}

  async execute(command: UnsendOutcomingBroadcastCommand): Promise<void> {
    const {} = command;
  }
}
