import { ICommand } from '@nestjs/cqrs';

export class AddPublicationLikeCommand implements ICommand {
  constructor(
    readonly current_profile_id: string,
    readonly publication_id: string,
  ) {}
}
