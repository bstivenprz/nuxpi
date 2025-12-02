import { ICommand } from '@nestjs/cqrs';

export class UnfollowCommand implements ICommand {
  constructor(
    readonly follower_profile_id: string,
    readonly followed_username: string,
  ) {}
}
