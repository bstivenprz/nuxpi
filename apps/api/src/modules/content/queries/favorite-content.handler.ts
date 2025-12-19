import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FavoriteContentQuery } from './favorite-content.query';
import {
  PaginationMetaObject,
  PaginationObject,
} from '@/common/models/pagination';
import { PublicationObject } from '../objects/publication.object';
import { Like } from '../entities/like.entity';
import { Audience, Publication } from '../entities/publication.entity';
import { AssetObject } from '../objects/asset.object';
import { Asset, AssetType } from '../entities/asset.entity';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';

@QueryHandler(FavoriteContentQuery)
export class FavoriteContentQueryHandler
  implements
    IQueryHandler<FavoriteContentQuery, PaginationObject<PublicationObject>>
{
  @InjectMapper() mapper: Mapper;

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async execute(
    query: FavoriteContentQuery,
  ): Promise<PaginationObject<PublicationObject>> {
    const { current_profile_id, pagination } = query;

    const [favorite_publications, total_count] = await Like.findAndCount({
      where: {
        profile: {
          id: current_profile_id,
        },
      },
      relations: {
        publication: {
          author: true,
          assets: true,
        },
      },
      select: ['publication'],
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

    const mapped_publications = this.mapper.mapArray(
      favorite_publications.map(({ publication }) => ({
        ...publication,
      })),
      Publication,
      PublicationObject,
    );

    const transformed_publications = mapped_publications.map(
      (publication, index) => {
        const source = favorite_publications[index];
        return {
          ...publication,
          assets: this.mapper
            .mapArray(source.publication.assets, Asset, AssetObject)
            .map((asset) => ({
              ...asset,
              public_url: this.cloudinaryService.get_public_url(
                asset.cloudinary_public_id,
                asset.type === AssetType.IMAGE ? 'image' : 'video',
                source.publication.audience === Audience.PAID_ONLY,
              ),
              placeholder_url: this.cloudinaryService.get_placeholder_url(
                asset.cloudinary_public_id,
              ),
            })),
          is_owner: source.publication.author.id === current_profile_id,
          is_liked: true,
        };
      },
    );

    return new PaginationObject(
      transformed_publications,
      new PaginationMetaObject({
        options: pagination,
        total_count: total_count,
      }),
    );
  }
}
