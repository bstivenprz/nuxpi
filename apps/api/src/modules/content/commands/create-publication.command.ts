import { ICommand } from '@nestjs/cqrs';
import { CreatePublicationBody } from '../objects/create-publication.object';

export class CreatePublicationCommand implements ICommand {
  constructor(
    readonly profile_id: string,
    readonly body: CreatePublicationBody,
  ) {}
}
