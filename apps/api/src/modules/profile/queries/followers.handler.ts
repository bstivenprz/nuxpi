import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FollowersQuery } from './followers.query';
import {
  PaginationMetaObject,
  PaginationObject,
} from '@/common/models/pagination';
import { PublicProfileObject } from '../objects/public-profile.object';
import { Follow } from '../entities/follow.entity';
import { Profile } from '../entities/profile.entity';

@QueryHandler(FollowersQuery)
export class FollowersQueryHandler
  implements
    IQueryHandler<FollowersQuery, PaginationObject<PublicProfileObject>>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(
    query: FollowersQuery,
  ): Promise<PaginationObject<PublicProfileObject>> {
    const { current_profile_id, pagination, username } = query;

    const followed = await Profile.findOneBy({ username });

    const total_count = await Follow.createQueryBuilder('follow')
      .where('follow.followed_id = :followed_id', { followed_id: followed.id })
      .getCount();

    if (total_count === 0) {
      return new PaginationObject(
        [],
        new PaginationMetaObject({
          options: pagination,
          total_count: 0,
        }),
      );
    }

    const queryBuilder = Follow.createQueryBuilder('follow')
      .innerJoin('follow.follower', 'follower')
      .leftJoin(
        'follows',
        'auth_follow',
        'auth_follow.follower_id = :current_profile_id AND auth_follow.followed_id = follower.id',
        { current_profile_id },
      )
      .where('follow.followed_id = :followed_profile_id', {
        followed_profile_id: followed.id,
      })
      .select([
        'follow.id',
        'follow.created_at',
        'follower.id',
        'follower.name',
        'follower.username',
        'follower.presentation',
        'follower.followers_count',
      ])
      .addSelect(
        'CASE WHEN auth_follow.id IS NOT NULL THEN true ELSE false END',
        'is_following',
      )
      .addSelect(
        'CASE WHEN follower.id = :current_profile_id THEN true ELSE false END',
        'is_owner',
      )
      .orderBy('follow.created_at', 'DESC')
      .skip(pagination.skip)
      .take(pagination.take);

    const { entities, raw } = await queryBuilder.getRawAndEntities();

    const profiles = this.mapper.mapArray(
      entities.map((f) => f.follower),
      Profile,
      PublicProfileObject,
    );

    return new PaginationObject(
      profiles.map((profile, index) => ({
        ...profile,
        is_following:
          raw[index].is_following === true || raw[index].is_following === 1,
        is_owner: raw[index].is_owner === true || raw[index].is_owner === 1,
      })),
      new PaginationMetaObject({
        options: pagination,
        total_count,
      }),
    );
  }
}
