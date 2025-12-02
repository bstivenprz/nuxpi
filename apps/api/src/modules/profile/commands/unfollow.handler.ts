import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UnfollowCommand } from './unfollow.command';
import { Follow } from '../entities/follow.entity';
import { Profile } from '../entities/profile.entity';
import { FollowObject } from '../objects/follow.object';

@CommandHandler(UnfollowCommand)
export class UnfollowCommandHandler
  implements ICommandHandler<UnfollowCommand, FollowObject>
{
  constructor() {}

  async execute(command: UnfollowCommand): Promise<FollowObject> {
    const { follower_profile_id, followed_username } = command;

    const follow = await Follow.findOne({
      where: {
        follower: {
          id: follower_profile_id,
        },
        followed: {
          username: followed_username,
        },
      },
    });

    if (!follow)
      return {
        is_following: false,
      };

    await follow.remove();

    const followed = await Profile.findOneBy({ username: followed_username });
    followed.followers_count -= 1;
    await followed.save();

    return {
      is_following: false,
    };
  }
}
