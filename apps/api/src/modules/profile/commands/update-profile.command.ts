import { ICommand } from '@nestjs/cqrs';

import { PublicProfileObject } from '../objects/public-profile.object';

export class UpdateProfileCommand implements ICommand {
  constructor(
    readonly profile_id: string,
    readonly body: Partial<PublicProfileObject>,
  ) {}
}
