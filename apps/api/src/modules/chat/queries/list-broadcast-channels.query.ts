import { IQuery } from '@nestjs/cqrs';

export class ListBroadcastChannelsQuery implements IQuery {
  constructor(readonly current_profile_id: string) {}
}
