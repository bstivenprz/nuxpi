import { Session } from '@/auth/decorators/session.decorator';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SendBroadcastCommand } from '../commands/send-broadcast.command';
import { SendBroadcastObject } from '../objects/send-broadcast.object';
import { UnsendOutcomingBroadcastCommand } from '../commands/unsend-outcoming-broadcast.command';
import { CheckRunningBroadcastQuery } from '../queries/check-running-broadcast.query';
import { ListBroadcastChannelsQuery } from '../queries/list-broadcast-channels.query';

@Controller('broadcast')
export class BroadcastController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('send')
  send(
    @Session('profile_id') profile_id: string,
    @Query('channel') channel: string,
    @Body() body?: SendBroadcastObject,
  ) {
    return this.commandBus.execute(
      new SendBroadcastCommand(profile_id, channel, body),
    );
  }

  @Post('unsend')
  unsend(@Session('profile_id') profile_id: string) {
    return this.commandBus.execute(
      new UnsendOutcomingBroadcastCommand(profile_id),
    );
  }

  @Get('status')
  status(@Session('profile_id') profile_id: string) {
    return this.queryBus.execute(new CheckRunningBroadcastQuery(profile_id));
  }

  @Get('channels')
  channels(@Session('profile_id') profile_id: string) {
    return this.queryBus.execute(new ListBroadcastChannelsQuery(profile_id));
  }
}
