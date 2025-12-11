import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetPublicationQuery } from './get-publication.query';
import { PublicationObject } from '../objects/publication.object';
import { Publication } from '../entities/publication.entity';
import { Like } from '../entities/like.entity';
import { Exception } from '@/common/models/http-exception';
import { Result } from '@/common/utils/result.util';

@QueryHandler(GetPublicationQuery)
export class GetPublicationQueryHandler
  implements IQueryHandler<GetPublicationQuery, PublicationObject>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: GetPublicationQuery): Promise<PublicationObject> {
    const { current_profile_id, id } = query;

    const publication = await Result.orFail(
      Publication.findOne({
        where: {
          id,
        },
        relations: {
          author: true,
        },
      }),
      Exception.NotFound('publication_not_found'),
    );

    const is_liked = await Like.exists({
      where: {
        publication: {
          id: publication.id,
        },
        profile: {
          id: current_profile_id,
        },
      },
    });

    return this.mapper.map(publication, Publication, PublicationObject, {
      afterMap: (source, destination) => {
        destination.is_owner = source.author.id === current_profile_id;
        destination.is_liked = is_liked;
      },
    });
  }
}
