import { IQuery } from '@nestjs/cqrs';

export class GetPublicationQuery implements IQuery {
  constructor(
    readonly current_profile_id: string,
    readonly id: string,
  ) {}
}
