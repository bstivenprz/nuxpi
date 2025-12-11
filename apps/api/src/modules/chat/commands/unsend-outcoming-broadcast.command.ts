import { ICommand } from '@nestjs/cqrs';

export class UnsendOutcomingBroadcastCommand implements ICommand {
  constructor(readonly current_profile_id: string) {}
}
