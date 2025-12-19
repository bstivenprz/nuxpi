import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { AddPublicationLikeCommand } from './add-publication-like.command';
import { Like } from '../entities/like.entity';
import { Publication } from '../entities/publication.entity';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { PublicationLikedEvent } from '../events/publication-liked.event';

@CommandHandler(AddPublicationLikeCommand)
export class AddPublicationLikeCommandHandler
  implements ICommandHandler<AddPublicationLikeCommand, void>
{
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: AddPublicationLikeCommand): Promise<void> {
    const { current_profile_id, publication_id } = command;

    const existing_favorite = await Like.exists({
      where: {
        publication: {
          id: publication_id,
        },
        profile: {
          id: current_profile_id,
        },
      },
    });

    if (existing_favorite) return;

    const publication = await Publication.findOne({
      where: { id: publication_id },
      relations: { author: true },
    });
    if (!publication) return;

    const profile = await Profile.findOneBy({ id: current_profile_id });

    const favorite = new Like({
      publication,
      profile,
    });
    await favorite.save();

    publication.likes_count = (publication.likes_count || 0) + 1;
    await publication.save();

    this.eventBus.publish(new PublicationLikedEvent(publication));
  }
}
