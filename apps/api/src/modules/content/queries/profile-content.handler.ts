import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProfileContentQuery } from './profile-content.query';
import {
  PaginationMetaObject,
  PaginationObject,
} from '@/common/models/pagination';
import { PublicationObject } from '../objects/publication.object';
import { Publication } from '../entities/publication.entity';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { Like } from '../entities/like.entity';
import { In } from 'typeorm';
import { Asset } from '../entities/asset.entity';
import { AssetObject } from '../objects/asset.object';

@QueryHandler(ProfileContentQuery)
export class ProfileContentQueryHandler
  implements
    IQueryHandler<ProfileContentQuery, PaginationObject<PublicationObject>>
{
  @InjectMapper() mapper: Mapper;

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async execute(
    query: ProfileContentQuery,
  ): Promise<PaginationObject<PublicationObject>> {
    const { current_profile_id, username, pagination } = query;

    const [publications, total_count] = await Publication.findAndCount({
      where: {
        author: {
          username,
        },
      },
      relations: {
        author: true,
        assets: true,
      },
      skip: pagination.skip,
      take: pagination.take,
      order: {
        created_at: 'DESC',
      },
    });

    if (total_count === 0) {
      return new PaginationObject(
        [],
        new PaginationMetaObject({
          options: pagination,
          total_count: total_count,
        }),
      );
    }

    const liked_publications_ids = await Like.find({
      where: {
        profile: {
          id: current_profile_id,
        },
        publication: {
          id: In(publications.map((p) => p.id)),
        },
      },
      relations: {
        publication: true,
      },
      select: ['publication'],
    }).then((likes) => new Set(likes.map((like) => like.publication.id)));

    const mappedPublications = this.mapper.mapArray(
      publications,
      Publication,
      PublicationObject,
    );

    const transformedPublications = mappedPublications.map((pub, index) => {
      const source = publications[index];
      return {
        ...pub,
        assets: this.mapper.mapArray(source.assets, Asset, AssetObject),
        is_owner: source.author.id === current_profile_id,
        is_liked: liked_publications_ids.has(source.id),
      };
    });

    return new PaginationObject(
      transformedPublications,
      new PaginationMetaObject({
        options: pagination,
        total_count,
      }),
    );
  }
}
