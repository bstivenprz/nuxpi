import { IEvent } from '@nestjs/cqrs';
import { Publication } from '../entities/publication.entity';

export class PublicationPublishedEvent implements IEvent {
  constructor(readonly publication: Publication) {}
}
