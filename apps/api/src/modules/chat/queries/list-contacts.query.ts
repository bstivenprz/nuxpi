import { IQuery } from '@nestjs/cqrs';

export class ListContactsQuery implements IQuery {
  constructor(readonly current_profile_id: string) {}
}
