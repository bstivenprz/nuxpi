import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteCommentCommand } from './delete-comment.command';
import { Comment } from '../entities/comment.entity';
import { Publication } from '../entities/publication.entity';

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentCommandHandler
  implements ICommandHandler<DeleteCommentCommand, void>
{
  constructor() {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    const { comment_id, current_profile_id, publication_id } = command;

    const comment = await Comment.findOne({
      where: {
        id: comment_id,
        publication: {
          id: publication_id,
        },
        author: {
          id: current_profile_id,
        },
      },
    });
    if (!comment) return;

    await comment.remove();

    const publication = await Publication.findOneBy({ id: publication_id });
    if (!publication) return;

    publication.comments_count = (publication.comments_count || 0) - 1;
    await publication.save();
  }
}
