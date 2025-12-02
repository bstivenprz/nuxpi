import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { FollowCommand } from './follow.command';
import { Follow } from '../entities/follow.entity';
import { Profile } from '../entities/profile.entity';
import { Result } from '@/common/utils/result.util';
import { Exception } from '@/common/models/http-exception';
import { FollowObject } from '../objects/follow.object';

@CommandHandler(FollowCommand)
export class FollowCommandHandler
  implements ICommandHandler<FollowCommand, FollowObject>
{
  constructor() {}

  async execute(command: FollowCommand): Promise<FollowObject> {
    const { follower_profile_id, followed_username } = command;

    if (
      await Follow.exists({
        where: {
          follower: {
            id: follower_profile_id,
          },
          followed: {
            username: followed_username,
          },
        },
      })
    )
      return {
        is_following: true,
      };

    const target_profile = await Result.orFail(
      Profile.findOneBy({ username: followed_username }),
      Exception.NotFound('target_profile_not_found'),
    );

    const follower = new Follow();
    follower.follower = await Profile.findOneBy({ id: follower_profile_id });
    follower.followed = target_profile;
    await follower.save();

    target_profile.followers_count += 1;
    await target_profile.save();

    return {
      is_following: true,
    };
  }
}
