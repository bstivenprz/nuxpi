import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeletePublicationCommand } from './delete-publication.command';
import { Publication } from '../entities/publication.entity';
import { Exception } from '@/common/models/http-exception';

@CommandHandler(DeletePublicationCommand)
export class DeletePublicationCommandHandler
  implements ICommandHandler<DeletePublicationCommand, void>
{
  constructor() {}

  async execute(command: DeletePublicationCommand): Promise<void> {
    const { profile_id, publication_id } = command;

    const publication = await Publication.findOne({
      where: { id: publication_id },
      relations: ['author'],
    });
    if (!publication) return;

    if (publication.author.id !== profile_id)
      throw Exception.Forbidden('publication_not_owned');

    await publication.remove();
  }
}
