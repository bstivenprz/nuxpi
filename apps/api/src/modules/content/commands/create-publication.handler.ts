import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreatePublicationCommand } from './create-publication.command';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { Exception } from '@/common/models/http-exception';
import { Publication } from '../entities/publication.entity';
import { Asset, AssetType } from '../entities/asset.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { PublicationObject } from '../objects/publication.object';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

@CommandHandler(CreatePublicationCommand)
export class CreatePublicationCommandHandler
  implements ICommandHandler<CreatePublicationCommand, PublicationObject>
{
  @InjectMapper() mapper: Mapper;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
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
          type: body.type,
        });

        if (body.assets) {
          const assets = body.assets.map((asset) => {
            return new Asset({
              type: AssetType.IMAGE,
              cloudinary_public_id: asset,
            });
          });

          publication.assets = assets;
        }

        await transactionalEntityManager.save(publication);

        return this.mapper.map(publication, Publication, PublicationObject);
      },
    );
  }
}
