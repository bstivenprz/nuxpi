import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UnlockPublicationCommand } from './unlock-publication.command';
import { PublicationObject } from '../objects/publication.object';
import {
  Audience,
  Publication,
  PublicationType,
} from '../entities/publication.entity';
import { Exception } from '@/common/models/http-exception';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';

@CommandHandler(UnlockPublicationCommand)
export class UnlockPublicationCommandHandler
  implements ICommandHandler<UnlockPublicationCommand, PublicationObject>
{
  @InjectMapper() mapper: Mapper;

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async execute(command: UnlockPublicationCommand): Promise<PublicationObject> {
    const { profile_id, publication_id } = command;

    const publication = await Publication.findOne({
      where: {
        id: publication_id,
      },
      relations: {
        author: true,
      },
    });

    if (!publication) throw Exception.NotFound('publication_not_found');

    if (publication.author.id !== profile_id)
      throw Exception.Forbidden('publication_not_owned');

    if (publication.audience !== Audience.PAID_ONLY)
      throw Exception.BadRequest('publication_is_not_paid');

    if (publication.type !== PublicationType.MULTIMEDIA)
      throw Exception.BadRequest('publication_is_not_multimedia');

    if (!publication.assets || publication.assets.length === 0)
      throw Exception.BadRequest('publication_has_no_assets');

    const mapped = this.mapper.map(publication, Publication, PublicationObject);

    const unlocked_assets = mapped.assets.map((asset) => ({
      ...asset,
      public_url: this.cloudinaryService.cloudinary.url(
        asset.cloudinary_public_id,
        {
          secure: true,
          type: 'authenticated',
          sign_url: true,
          resource_type: asset.type,
        },
      ),
    }));

    return {
      ...mapped,
      assets: unlocked_assets,
    };
  }
}
