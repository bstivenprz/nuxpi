import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UnpinPublicationCommand } from './unpin-publication.command';
import { PinnedPublication } from '../entities/pinned-publication.entity';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@CommandHandler(UnpinPublicationCommand)
export class UnpinPublicationCommandHandler
  implements ICommandHandler<UnpinPublicationCommand, void>
{
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async execute(command: UnpinPublicationCommand): Promise<void> {
    const { current_profile_id, publication_id } = command;

    const existing_pinned_publication = await PinnedPublication.exists({
      where: {
        profile: { id: current_profile_id },
        publication: { id: publication_id },
      },
    });

    if (!existing_pinned_publication) return;

    await this.entityManager.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .delete()
        .from(PinnedPublication)
        .where(
          'profile_id = :current_profile_id AND publication_id = :publication_id',
          { current_profile_id, publication_id },
        )
        .execute();
    });
  }
}
