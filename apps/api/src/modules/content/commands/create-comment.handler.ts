import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateCommentCommand } from './create-comment.command';
import { Comment } from '../entities/comment.entity';
import { Exception } from '@/common/models/http-exception';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { Publication } from '../entities/publication.entity';

@CommandHandler(CreateCommentCommand)
export class CreateCommentCommandHandler
  implements ICommandHandler<CreateCommentCommand, void>
{
  constructor() {}

  async execute(command: CreateCommentCommand): Promise<void> {
    const { current_profile_id, publication_id, body } = command;

    const profile = await Profile.findOneBy({ id: current_profile_id });
    const publication = await Publication.findOneBy({ id: publication_id });
    if (!publication) throw Exception.NotFound('publication_not_found');

    const comment = new Comment({
      content: body.content,
      publication,
      author: profile,
    });
    await comment.save();

    publication.comments_count = (publication.comments_count || 0) + 1;
    await publication.save();
  }
}
