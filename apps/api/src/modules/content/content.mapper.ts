import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { Publication } from './entities/publication.entity';
import { PublicationObject } from './objects/publication.object';
import { CommentObject } from './objects/comment.object';
import { Comment } from './entities/comment.entity';

@Injectable()
export class ContentMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Publication, PublicationObject);
      createMap(mapper, Comment, CommentObject);
    };
  }
}
