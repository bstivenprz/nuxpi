import { PaginationQuery } from '@/common/models/pagination';
import { IQuery } from '@nestjs/cqrs';

export class ListNotificationsQuery implements IQuery {
  constructor(
    public readonly current_profile_id: string,
    public readonly pagination: PaginationQuery,
  ) {}
}
