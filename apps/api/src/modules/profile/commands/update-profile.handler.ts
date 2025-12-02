import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateProfileCommand } from './update-profile.command';
import { Profile } from '../entities/profile.entity';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileCommandHandler
  implements ICommandHandler<UpdateProfileCommand, void>
{
  constructor() {}

  async execute(command: UpdateProfileCommand): Promise<void> {
    const { profile_id, body } = command;
    const profile = await Profile.findOneBy({ id: profile_id });
    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined) {
        profile[key] = body[key];
      }
    });
    await profile.save();
  }
}
