import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetProfileQuery } from './get-profile.query';
import { Profile } from '../entities/profile.entity';
import { ProfileObject } from '../objects/profile.object';

@QueryHandler(GetProfileQuery)
export class GetProfileQueryHandler
  implements IQueryHandler<GetProfileQuery, ProfileObject>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: GetProfileQuery): Promise<ProfileObject> {
    const { profile_id } = query;
    return this.mapper.mapAsync(
      await Profile.findOneBy({ id: profile_id }),
      Profile,
      ProfileObject,
    );
  }
}
