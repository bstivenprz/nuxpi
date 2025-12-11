import { IQuery } from '@nestjs/cqrs';

export class SearchContactsQuery implements IQuery {
  constructor(
    readonly current_profile_id: string,
    readonly query?: string,
  ) {}
}
