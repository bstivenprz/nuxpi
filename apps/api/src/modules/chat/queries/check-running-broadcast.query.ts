import { IQuery } from '@nestjs/cqrs';

export class CheckRunningBroadcastQuery implements IQuery {
  constructor(readonly current_profile_id: string) {}
}
