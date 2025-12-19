import { PaginationQuery } from '@/common/models/pagination';
import { IQuery } from '@nestjs/cqrs';

export class ProfileContentQuery implements IQuery {
  constructor(
    readonly current_profile_id: string,
    readonly username: string,
    readonly pagination: PaginationQuery,
    readonly type: 'all' | 'multimedia',
    readonly media_type: 'all' | 'image' | 'video',
  ) {}
}
