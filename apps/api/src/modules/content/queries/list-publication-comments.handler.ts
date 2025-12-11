import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ListPublicationCommentsQuery } from './list-publication-comments.query';
import { Comment } from '../entities/comment.entity';
import {
  PaginationMetaObject,
  PaginationObject,
} from '@/common/models/pagination';
import { CommentObject } from '../objects/comment.object';

@QueryHandler(ListPublicationCommentsQuery)
export class ListPublicationCommentsQueryHandler
  implements
    IQueryHandler<ListPublicationCommentsQuery, PaginationObject<CommentObject>>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(
    query: ListPublicationCommentsQuery,
  ): Promise<PaginationObject<CommentObject>> {
    const { current_profile_id, publication_id, pagination } = query;

    const [comments, total_count] = await Comment.findAndCount({
      where: {
        publication: {
          id: publication_id,
        },
      },
      relations: {
        author: true,
      },
      skip: pagination.skip,
      take: pagination.take,
      order: {
        created_at: 'DESC',
      },
    });

    if (total_count === 0) {
      return new PaginationObject<CommentObject>(
        [],
        new PaginationMetaObject({
          options: pagination,
          total_count: total_count,
        }),
      );
    }

    const mappedComments = this.mapper.mapArray(
      comments,
      Comment,
      CommentObject,
    );

    const transformedComments = mappedComments.map((comment, index) => {
      const source = comments[index];
      return {
        ...comment,
        is_owner: source.author.id === current_profile_id,
      };
    });

    return new PaginationObject<CommentObject>(
      transformedComments,
      new PaginationMetaObject({
        options: pagination,
        total_count: total_count,
      }),
    );
  }
}
