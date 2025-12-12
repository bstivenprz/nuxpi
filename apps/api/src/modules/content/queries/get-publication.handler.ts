import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetPublicationQuery } from './get-publication.query';
import { PublicationObject } from '../objects/publication.object';
import { Publication } from '../entities/publication.entity';
import { Like } from '../entities/like.entity';
import { Exception } from '@/common/models/http-exception';
import { Result } from '@/common/utils/result.util';
import { Asset } from '../entities/asset.entity';
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

    // Fetch placeholder data URLs for all assets in parallel
    const placeholderDataUrls = await Promise.all(
      publication.assets.map((asset) =>
        this.cloudinaryService
          .getPlaceholderDataUrl(asset.cloudinary_public_id)
          .catch(() => null),
      ),
    );

    return this.mapper.map(publication, Publication, PublicationObject, {
      afterMap: (source, destination) => {
        destination.assets = source.assets.map((asset, index) => {
          const mapped = this.mapper.map(asset, Asset, AssetObject, {
            afterMap: (source, destination) => {
              destination.public_url = this.cloudinaryService.getPublicUrl(
                source.cloudinary_public_id,
                source.type === 'image' ? 'image' : 'video',
              );
              destination.placeholder_url =
                placeholderDataUrls[index] ||
                this.cloudinaryService.getPlaceholderUrl(
                  source.cloudinary_public_id,
                );
            },
          });
          return mapped;
        });
        destination.is_owner = source.author.id === current_profile_id;
        destination.is_liked = is_liked;
      },
    });
  }
}
