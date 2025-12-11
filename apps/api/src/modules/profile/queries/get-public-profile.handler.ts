import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetPublicProfileQuery } from './get-public-profile.query';
import { Result } from '@/common/utils/result.util';
import { Profile } from '../entities/profile.entity';
import { Exception } from '@/common/models/http-exception';
import { PublicProfileObject } from '../objects/public-profile.object';
import { Follow } from '../entities/follow.entity';

@QueryHandler(GetPublicProfileQuery)
export class GetPublicProfileQueryHandler
  implements IQueryHandler<GetPublicProfileQuery, PublicProfileObject>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: GetPublicProfileQuery): Promise<PublicProfileObject> {
    const { current_username, username } = query;

    const public_profile = await Result.orFail(
      Profile.findOneBy({ username }),
      Exception.NotFound('profile_not_found'),
    );

    const followers_count = await Follow.createQueryBuilder('follow')
      .leftJoin(
        'follow.followed',
        'followed',
        'follow.followed_id = followed.id',
      )
      .where('followed.id = :followed_id', { followed_id: public_profile.id })
      .getCount();

    const is_following = await Follow.createQueryBuilder('follow')
      .leftJoin(
        'follow.follower',
        'follower',
        'follow.follower_id = follower.id AND follow.followed_id = :followed_id',
        {
          followed_id: public_profile.id,
        },
      )
      .where('follower.username = :current_username', { current_username })
      .getExists();

    return this.mapper.map(public_profile, Profile, PublicProfileObject, {
      afterMap: (source, destination) => {
        destination.is_owner = source.username === current_username;
        destination.is_following = is_following;
        destination.followers_count = followers_count;
      },
    });
  }
}
