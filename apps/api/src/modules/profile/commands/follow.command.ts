import { ICommand } from '@nestjs/cqrs';

export class FollowCommand implements ICommand {
  constructor(
    readonly follower_profile_id: string,
    readonly followed_username: string,
  ) {}
}
