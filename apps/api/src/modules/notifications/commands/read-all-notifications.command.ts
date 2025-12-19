import { ICommand } from '@nestjs/cqrs';

export class ReadAllNotificationsCommand implements ICommand {
  constructor(public readonly current_profile_id: string) {}
}
