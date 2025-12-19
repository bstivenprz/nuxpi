import { ICommand } from '@nestjs/cqrs';

export class UnlockPublicationCommand implements ICommand {
  constructor(
    readonly profile_id: string,
    readonly publication_id: string,
  ) {}
}
