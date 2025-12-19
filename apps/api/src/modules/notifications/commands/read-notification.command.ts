import { ICommand } from '@nestjs/cqrs';

export class ReadNotificationCommand implements ICommand {
  constructor(
    public readonly current_profile_id: string,
    public readonly notification_id: string,
  ) {}
}
