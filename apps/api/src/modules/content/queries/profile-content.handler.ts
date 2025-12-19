import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProfileContentQuery } from './profile-content.query';
import {
  PaginationMetaObject,
  PaginationObject,
} from '@/common/models/pagination';
import { PublicationObject } from '../objects/publication.object';
import {
  Audience,
  Publication,
  PublicationType,
} from '../entities/publication.entity';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { Like } from '../entities/like.entity';
import { Equal, In } from 'typeorm';
import { Asset, AssetType } from '../entities/asset.entity';
import { AssetObject } from '../objects/asset.object';
import { PinnedPublication } from '../entities/pinned-publication.entity';

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
    const { current_profile_id, username, type, pagination, media_type } =
      query;

    const [publications, total_count] = await Publication.findAndCount({
      where: {
        author: {
          username,
        },
        type:
          type === 'multimedia'
            ? PublicationType.MULTIMEDIA
            : PublicationType.TEXT,
        assets: {
          type:
            media_type === 'all' ? undefined : Equal(media_type as AssetType),
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

    const pinned_publication = await PinnedPublication.findOne({
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
    });

    if (pinned_publication) {
      const pinned_index = publications.findIndex(
        (publication) => publication.id === pinned_publication.publication.id,
      );
      if (pinned_index > -1) {
        const [pinned_publication] = publications.splice(pinned_index, 1);
        publications.unshift(pinned_publication);
      }
    }

    const mapped_publications = this.mapper.mapArray(
      publications,
      Publication,
      PublicationObject,
    );

    const transformed_publications = mapped_publications.map(
      (publication, index) => {
        const source = publications[index];
        return {
          ...publication,
          assets: this.mapper
            .mapArray(source.assets, Asset, AssetObject)
            .map((asset) => ({
              ...asset,
              public_url: this.cloudinaryService.get_public_url(
                asset.cloudinary_public_id,
                asset.type === AssetType.IMAGE ? 'image' : 'video',
                source.audience === Audience.PAID_ONLY,
              ),
              placeholder_url: this.cloudinaryService.get_placeholder_url(
                asset.cloudinary_public_id,
              ),
            })),
          is_owner: source.author.id === current_profile_id,
          is_liked: liked_publications_ids.has(source.id),
          is_pinned: source.id === pinned_publication?.publication.id,
        };
      },
    );

    return new PaginationObject(
      transformed_publications,
      new PaginationMetaObject({
        options: pagination,
        total_count,
      }),
    );
  }
}
