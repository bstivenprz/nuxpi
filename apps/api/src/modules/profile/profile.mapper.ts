import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { Profile } from './entities/profile.entity';
import { ProfileObject } from './objects/profile.object';
import { PublicProfileObject } from './objects/public-profile.object';

@Injectable()
export class ProfileMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Profile, ProfileObject);
      createMap(mapper, Profile, PublicProfileObject);
    };
  }
}
