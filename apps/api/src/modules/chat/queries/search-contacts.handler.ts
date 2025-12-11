import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { SearchContactsQuery } from './search-contacts.query';
import { PublicProfileObject } from '@/modules/profile/objects/public-profile.object';
import { Follow } from '@/modules/profile/entities/follow.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Profile } from '@/modules/profile/entities/profile.entity';

@QueryHandler(SearchContactsQuery)
export class SearchContactsQueryHandler
  implements IQueryHandler<SearchContactsQuery, PublicProfileObject[]>
{
  @InjectMapper() mapper: Mapper;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async execute(query: SearchContactsQuery): Promise<PublicProfileObject[]> {
    const { current_profile_id, query: searchQuery } = query;

    if (!searchQuery || searchQuery.trim().length === 0) {
      return [];
    }

    const search = `${searchQuery}%`;

    const followingsQB = Follow.createQueryBuilder('f')
      .innerJoin('Profile', 'p', 'p.id = f.followed_id')
      .select([
        'p.id as id',
        'p.name as name',
        'p.username as username',
        'p.picture as picture',
      ])
      .where('f.follower_id = :current_profile_id', { current_profile_id })
      .andWhere('(p.name ILIKE :search OR p.username ILIKE :search)', {
        search,
      });

    const followersQB = Follow.createQueryBuilder('f')
      .innerJoin('Profile', 'p', 'p.id = f.follower_id')
      .select([
        'p.id as id',
        'p.name as name',
        'p.username as username',
        'p.picture as picture',
      ])
      .where('f.followed_id = :current_profile_id', { current_profile_id })
      .andWhere('(p.name ILIKE :search OR p.username ILIKE :search)', {
        search,
      });

    const profiles: Profile[] = await this.entityManager
      .createQueryBuilder()
      .select('*')
      .from(
        '(' +
          followingsQB.getQuery() +
          ' UNION ' +
          followersQB.getQuery() +
          ')',
        'profiles',
      )
      .setParameters({
        ...followingsQB.getParameters(),
        ...followersQB.getParameters(),
      })
      .where('profiles.id != :current_profile_id', { current_profile_id })
      .getRawMany();

    return this.mapper.mapArray(profiles, Profile, PublicProfileObject);
  }
}
