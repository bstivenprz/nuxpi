import { ICommand } from '@nestjs/cqrs';

export class DeleteCommentCommand implements ICommand {
  constructor(
    readonly current_profile_id: string,
    readonly publication_id: string,
    readonly comment_id: string,
  ) {}
}
