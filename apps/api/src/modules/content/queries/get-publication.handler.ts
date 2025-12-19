import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetPublicationQuery } from './get-publication.query';
import { PublicationObject } from '../objects/publication.object';
import { Audience, Publication } from '../entities/publication.entity';
import { Like } from '../entities/like.entity';
import { Exception } from '@/common/models/http-exception';
import { Result } from '@/common/utils/result.util';
import { Asset, AssetType } from '../entities/asset.entity';
import { AssetObject } from '../objects/asset.object';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';

@QueryHandler(GetPublicationQuery)
export class GetPublicationQueryHandler
  implements IQueryHandler<GetPublicationQuery, PublicationObject>
{
  @InjectMapper() mapper: Mapper;

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async execute(query: GetPublicationQuery): Promise<PublicationObject> {
    const { current_profile_id, id } = query;

    const publication = await Result.orFail(
      Publication.findOne({
        where: {
          id,
        },
        relations: {
          author: true,
          assets: true,
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

    const placeholderDataUrls = await Promise.all(
      publication.assets.map((asset) =>
        this.cloudinaryService
          .getPlaceholderDataUrl(asset.cloudinary_public_id)
          .catch(() => null),
      ),
    );

    const assets = publication.assets.map((asset, index) => {
      const mapped = this.mapper.map(asset, Asset, AssetObject);
      mapped.public_url = this.getAssetPublicUrl(
        asset.cloudinary_public_id,
        asset.type,
        publication.audience === Audience.PAID_ONLY,
      );
      mapped.placeholder_url =
        placeholderDataUrls[index] ||
        this.cloudinaryService.getPlaceholderUrl(asset.cloudinary_public_id);
      return mapped;
    });

    return this.mapper.map(publication, Publication, PublicationObject, {
      afterMap: (source, destination) => {
        destination.assets = assets;
        destination.is_owner = source.author.id === current_profile_id;
        destination.is_liked = is_liked;
      },
    });
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
