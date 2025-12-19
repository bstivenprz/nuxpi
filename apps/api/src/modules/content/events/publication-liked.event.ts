import { IEvent } from '@nestjs/cqrs';
import { Publication } from '../entities/publication.entity';

export class PublicationLikedEvent implements IEvent {
  constructor(readonly publication: Publication) {}
}
