import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PinPublicationCommand } from './pin-publication.command';
import { PinnedPublication } from '../entities/pinned-publication.entity';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@CommandHandler(PinPublicationCommand)
export class PinPublicationCommandHandler
  implements ICommandHandler<PinPublicationCommand, void>
{
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async execute(command: PinPublicationCommand): Promise<void> {
    const { current_profile_id, publication_id } = command;

    const existing_pinned_publication = await PinnedPublication.exists({
      where: {
        profile: { id: current_profile_id },
        publication: { id: publication_id },
      },
    });

    if (existing_pinned_publication) return;

    await this.entityManager.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .insert()
        .into(PinnedPublication)
        .values({
          profile: { id: current_profile_id },
          publication: { id: publication_id },
        })
        .orIgnore()
        .execute();
    });
  }
}
