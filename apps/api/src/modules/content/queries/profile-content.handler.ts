import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProfileContentQuery } from './profile-content.query';
import {
  PaginationMetaObject,
  PaginationObject,
} from '@/common/models/pagination';
import { PublicationObject } from '../objects/publication.object';
import { Audience, Publication } from '../entities/publication.entity';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { Like } from '../entities/like.entity';
import { In } from 'typeorm';
import { Asset, AssetType } from '../entities/asset.entity';
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
        assets: this.mapper
          .mapArray(source.assets, Asset, AssetObject)
          .map((asset) => ({
            ...asset,
            public_url: this.getAssetPublicUrl(
              asset.cloudinary_public_id,
              asset.type,
              source.audience === Audience.PAID_ONLY,
            ),
            placeholder_url: this.cloudinaryService.getPlaceholderUrl(
              asset.cloudinary_public_id,
            ),
          })),
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

  private getAssetPublicUrl(
    public_id: string,
    asset_type: AssetType,
    isPaidOnly: boolean,
  ): string {
    if (!isPaidOnly) {
      return this.cloudinaryService.cloudinary.url(public_id, {
        secure: true,
        resource_type: asset_type,
      });
    }

    const transformations =
      asset_type === AssetType.IMAGE
        ? this.imageUrlTransformations()
        : this.videoUrlTransformations();

    return this.cloudinaryService.cloudinary.url(public_id, {
      secure: true,
      type: 'authenticated',
      sign_url: true,
      resource_type: asset_type,
      transformation: transformations,
    });
  }

  private imageUrlTransformations(): Array<Record<string, unknown>> {
    return [
      {
        effect: 'blur:2000',
        quality: 'auto:low',
        fetch_format: 'auto',
      },
    ];
  }

  private videoUrlTransformations(): Array<Record<string, unknown>> {
    return [
      {
        format: 'webp',
        duration: '5',
        start_offset: '0',
        fps: '20',
        width: 640,
        height: 360,
        crop: 'fill',
        effect: 'blur:2000',
        quality: 'auto:low',
        flags: 'animated.awebp',
      },
    ];
  }
}
