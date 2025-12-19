import { Controller, Param, Post } from '@nestjs/common';
import { Session } from '@/auth/decorators/session.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { UnlockPublicationCommand } from '../commands/unlock-publication.command';

@Controller('ppv')
export class PPVController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':publication_id/unlock')
  unlock(
    @Session('profile_id') profile_id: string,
    @Param('publication_id') publication_id: string,
  ) {
    return this.commandBus.execute(
      new UnlockPublicationCommand(profile_id, publication_id),
    );
  }
}
