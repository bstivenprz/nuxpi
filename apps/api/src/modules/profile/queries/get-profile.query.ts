import { IQuery } from '@nestjs/cqrs';

export class GetProfileQuery implements IQuery {
  constructor(readonly profile_id: string) {}
}
