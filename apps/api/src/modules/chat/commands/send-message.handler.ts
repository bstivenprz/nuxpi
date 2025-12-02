import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SendMessageCommand } from './send-message.command';
import { Conversation } from '../entitites/conversation.entity';
import { Message } from '../entitites/message.entity';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { Exception } from '@/common/models/http-exception';

@CommandHandler(SendMessageCommand)
export class SendMessageCommandHandler
  implements ICommandHandler<SendMessageCommand, Message>
{
  constructor() {}

  async execute(command: SendMessageCommand): Promise<Message> {
    const { current_profile_id, conversation_id, content } = command;

    const conversation = await Conversation.findOneBy({ id: conversation_id });
    if (!conversation) throw Exception.NotFound('conversation_not_found');

    const sender = await Profile.findOneBy({ id: current_profile_id });
    if (!sender) throw Exception.NotFound('profile_not_found');

    const message = new Message();
    message.type = 'text';
    message.content = content;
    message.sender = sender;
    message.conversation = conversation;
    await message.save();

    return Message.findOne({
      where: { id: message.id },
      relations: { sender: true },
    });
  }
}
