import { PaginationQuery } from '@/common/models/pagination';
import { IQuery } from '@nestjs/cqrs';

export class FollowersQuery implements IQuery {
  constructor(
    readonly current_profile_id: string,
    readonly username: string,
    readonly pagination: PaginationQuery,
  ) {}
}
