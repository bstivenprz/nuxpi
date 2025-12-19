import { IQuery } from '@nestjs/cqrs';

export class DiscoverProfilesQuery implements IQuery {
  constructor(readonly current_profile_id: string) {}
}
