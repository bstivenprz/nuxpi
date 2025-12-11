import { ICommand } from '@nestjs/cqrs';
import { CreateCommentBody } from '../objects/create-comment.object';

export class CreateCommentCommand implements ICommand {
  constructor(
    readonly current_profile_id: string,
    readonly publication_id: string,
    readonly body: CreateCommentBody,
  ) {}
}
