import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ListBroadcastChannelsQuery } from './list-broadcast-channels.query';
import { ChannelObject } from '../objects/channel.object';
import { Follow } from '@/modules/profile/entities/follow.entity';

@QueryHandler(ListBroadcastChannelsQuery)
export class ListBroadcastChannelsQueryHandler
  implements IQueryHandler<ListBroadcastChannelsQuery, ChannelObject[]>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: ListBroadcastChannelsQuery): Promise<ChannelObject[]> {
    const { current_profile_id } = query;

    return await Promise.all([
      this.getFollowersChannel(current_profile_id),
      this.getFollowingChannel(current_profile_id),
    ]);
  }

  private async getFollowersChannel(
    current_followed_id: string,
  ): Promise<ChannelObject> {
    const count = await Follow.createQueryBuilder('follow')
      .where('follow.followed_id = :current_followed_id', {
        current_followed_id,
      })
      .getCount();

    const profiles = await Follow.createQueryBuilder('follow')
      .leftJoin(
        'follow.follower',
        'follower',
        'follow.follower_id = follower.id',
      )
      .where('follow.followed_id = :current_followed_id', {
        current_followed_id,
      })
      .select('follower.picture', 'picture')
      .getRawMany();

    return {
      key: 'followers',
      count,
      pictures: profiles.map((p) => p.picture),
    };
  }

  private async getFollowingChannel(
    current_follower_id: string,
  ): Promise<ChannelObject> {
    const count = await Follow.createQueryBuilder('follow')
      .where('follow.followed_id = :current_follower_id', {
        current_follower_id,
      })
      .getCount();

    const profiles = await Follow.createQueryBuilder('follow')
      .leftJoin(
        'follow.followed',
        'followed',
        'follow.followed_id = followed.id',
      )
      .where('follow.followed_id = :current_follower_id', {
        current_follower_id,
      })
      .select('followed.picture', 'picture')
      .getRawMany();

    return {
      key: 'following',
      count,
      pictures: profiles.map((p) => p.picture),
    };
  }
}
