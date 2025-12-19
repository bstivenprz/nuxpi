import { IQuery } from '@nestjs/cqrs';

export class DiscoverCreatorsQuery implements IQuery {
  constructor(readonly current_profile_id: string) {}
}
