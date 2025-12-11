import { PaginationQuery } from '@/common/models/pagination';
import { IQuery } from '@nestjs/cqrs';

export class ListPublicationCommentsQuery implements IQuery {
  constructor(
    readonly current_profile_id: string,
    readonly publication_id: string,
    readonly pagination: PaginationQuery,
  ) {}
}
