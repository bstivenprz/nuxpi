import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { DiscoverCreatorsQuery } from './discover-creators.query';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { Not } from 'typeorm';
import { PublicProfileObject } from '@/modules/profile/objects/public-profile.object';

@QueryHandler(DiscoverCreatorsQuery)
export class DiscoverCreatorsQueryHandler
  implements IQueryHandler<DiscoverCreatorsQuery, PublicProfileObject[]>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: DiscoverCreatorsQuery): Promise<PublicProfileObject[]> {
    const { current_profile_id } = query;

    const creators = await Profile.find({
      where: {
        id: Not(current_profile_id),
        is_creator: true,
      },
    });

    if (creators.length === 0) return [];

    return this.mapper.mapArray(creators, Profile, PublicProfileObject);
  }
}
