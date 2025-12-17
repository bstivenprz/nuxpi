import { ICommand } from '@nestjs/cqrs';

export class DeletePublicationCommand implements ICommand {
  constructor(
    public readonly profile_id: string,
    public readonly publication_id: string,
  ) {}
}
