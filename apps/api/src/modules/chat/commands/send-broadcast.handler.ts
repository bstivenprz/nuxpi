import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { SendBroadcastCommand } from './send-broadcast.command';
import { Broadcast } from '../entitites/broadcast.entity';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { Message } from '../entitites/message.entity';
import { ProcessBroadcastEvent } from '../events/process-broadcast.event';

@CommandHandler(SendBroadcastCommand)
export class SendBroadcastCommandHandler
  implements ICommandHandler<SendBroadcastCommand, void>
{
  constructor(private eventBus: EventBus) {}

  async execute(command: SendBroadcastCommand): Promise<void> {
    const { current_profile_id, target_channel, body } = command;

    const current_profile = await Profile.findOneBy({ id: current_profile_id });

    const message = new Message();
    message.content = 'Hola tú que me sigues!';
    message.sender = current_profile;
    message.is_broadcast = true;
    await message.save();

    const broadcast = new Broadcast();
    broadcast.status = 'pending';
    broadcast.started_at = new Date();
    broadcast.broadcasted_by = current_profile;
    broadcast.message = message;
    await broadcast.save();

    this.eventBus.publish(new ProcessBroadcastEvent(broadcast.id));
  }
}
