import { ICommand } from '@nestjs/cqrs';
import { SendBroadcastObject } from '../objects/send-broadcast.object';

export class SendBroadcastCommand implements ICommand {
  constructor(
    readonly current_profile_id: string,
    readonly target_channel: string,
    readonly body?: SendBroadcastObject,
  ) {}
}
