import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { RemovePublicationLikeCommand } from './remove-publication-like.command';
import { Like } from '../entities/like.entity';
import { Publication } from '../entities/publication.entity';

@CommandHandler(RemovePublicationLikeCommand)
export class RemovePublicationLikeCommandHandler
  implements ICommandHandler<RemovePublicationLikeCommand, void>
{
  constructor() {}

  async execute(command: RemovePublicationLikeCommand): Promise<void> {
    const { current_profile_id, publication_id } = command;

    const existing_favorite = await Like.findOne({
      where: {
        publication: {
          id: publication_id,
        },
        profile: {
          id: current_profile_id,
        },
      },
    });

    if (!existing_favorite) return;

    const publication = await Publication.findOneBy({ id: publication_id });
    if (!publication) return;

    await existing_favorite.remove();

    publication.likes_count = Math.max((publication.likes_count || 0) - 1, 0);
    await publication.save();
  }
}
