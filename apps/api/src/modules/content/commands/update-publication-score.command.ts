import { ICommand } from '@nestjs/cqrs';
import { Publication } from '../entities/publication.entity';

export class UpdatePublicationScoreCommand implements ICommand {
  constructor(readonly publication: Publication) {}
}
