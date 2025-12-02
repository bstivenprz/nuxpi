import { ICommand } from '@nestjs/cqrs';

export class SendMessageCommand implements ICommand {
  constructor(
    readonly current_profile_id: string,
    readonly conversation_id: string,
    readonly content?: string,
  ) {}
}
