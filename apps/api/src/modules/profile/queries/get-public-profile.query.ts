import { IQuery } from '@nestjs/cqrs';

export class GetPublicProfileQuery implements IQuery {
  constructor(
    readonly current_username: string | undefined,
    readonly username: string,
  ) {}
}
