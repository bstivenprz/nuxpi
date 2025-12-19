import { IQuery } from '@nestjs/cqrs';

export class CheckNotificationsCounterQuery implements IQuery {
  constructor(readonly current_profile_id: string) {}
}
