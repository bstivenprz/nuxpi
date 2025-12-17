import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreatePublicationCommand } from './create-publication.command';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { Exception } from '@/common/models/http-exception';
import {
  Audience,
  Publication,
  PublicationType,
} from '../entities/publication.entity';
import { Asset, AssetType } from '../entities/asset.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import { PublicationObject } from '../objects/publication.object';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { AssetObject } from '../objects/asset.object';

@CommandHandler(CreatePublicationCommand)
export class CreatePublicationCommandHandler
  implements ICommandHandler<CreatePublicationCommand, PublicationObject>
{
  @InjectMapper() mapper: Mapper;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: CreatePublicationCommand): Promise<PublicationObject> {
    const { profile_id, body } = command;
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const profile = await transactionalEntityManager.findOneBy(Profile, {
          id: profile_id,
        });
        if (!profile) throw Exception.NotFound('profile_not_found');

        const publication = new Publication({
          author: profile,
          caption: body.caption,
          audience: body.audience as Audience,
        });

        let assets: Asset[] = [];
        if (body.assets && body.assets.length > 0) {
          assets = await Asset.findBy({
            id: In(body.assets),
          });

          if (assets.length !== body.assets.length)
            throw Exception.BadRequest('assets_not_found');

          publication.type = PublicationType.MULTIMEDIA;
          publication.assets = assets;
        }

        await transactionalEntityManager.save(publication);

        return this.mapper.map(publication, Publication, PublicationObject, {
          afterMap: (source, destination) => {
            destination.assets = this.mapper
              .mapArray(assets, Asset, AssetObject)
              .map((asset) => ({
                ...asset,
                public_url: this.getAssetPublicUrl(
                  asset.cloudinary_public_id,
                  asset.type,
                  publication.audience === Audience.PAID_ONLY,
                ),
              }));
          },
        });
      },
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
