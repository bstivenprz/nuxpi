import { Body, Controller, Post } from '@nestjs/common';
import { SyncIdentityCommand } from '../commands/sync-identity.command';
import { CommandBus } from '@nestjs/cqrs';

@Controller('identity')
export class IdentityController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('sync')
  sync(@Body() command: SyncIdentityCommand) {
    return this.commandBus.execute(command);
  }
}
