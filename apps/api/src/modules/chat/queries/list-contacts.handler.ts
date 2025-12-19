import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ListContactsQuery } from './list-contacts.query';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { Follow } from '@/modules/profile/entities/follow.entity';
import { PublicProfileObject } from '@/modules/profile/objects/public-profile.object';

@QueryHandler(ListContactsQuery)
export class ListContactsQueryHandler
  implements IQueryHandler<ListContactsQuery, PublicProfileObject[]>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: ListContactsQuery): Promise<PublicProfileObject[]> {
    const { current_profile_id } = query;

    // Profiles the current user is following
    const following = await Follow.createQueryBuilder('follow')
      .leftJoinAndSelect('follow.followed', 'followed')
      .where('follow.follower_id = :current_profile_id', { current_profile_id })
      .getMany();

    // Profiles that follow the current user
    const followers = await Follow.createQueryBuilder('follow')
      .leftJoinAndSelect('follow.follower', 'follower')
      .where('follow.followed_id = :current_profile_id', { current_profile_id })
      .getMany();

    // Extract the profile on the "other side" of the follow relation
    const profiles = [
      ...following.map((f) => f.followed),
      ...followers.map((f) => f.follower),
    ];

    // De‑duplicate by profile id
    const uniqueProfilesMap = new Map<string, Profile>();
    for (const profile of profiles) {
      if (profile && !uniqueProfilesMap.has(profile.id)) {
        uniqueProfilesMap.set(profile.id, profile);
      }
    }

    const uniqueProfiles = Array.from(uniqueProfilesMap.values());

    return this.mapper.mapArray(uniqueProfiles, Profile, PublicProfileObject);
  }
}
