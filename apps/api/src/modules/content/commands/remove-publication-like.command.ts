import { ICommand } from '@nestjs/cqrs';

export class RemovePublicationLikeCommand implements ICommand {
  constructor(
    readonly current_profile_id: string,
    readonly publication_id: string,
  ) {}
}
