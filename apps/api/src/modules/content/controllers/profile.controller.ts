import { Session } from '@/auth/decorators/session.decorator';
import { PaginationQuery } from '@/common/models/pagination';
import {
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FavoriteContentQuery } from '../queries/favorite-content.query';
import { PinPublicationCommand } from '../commands/pin-publication.command';
import { UnpinPublicationCommand } from '../commands/unpin-publication.command';
import { ProfileContentQuery } from '../queries/profile-content.query';

@Controller('content/profile')
export class ContentProfileController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  @Get('public/:username')
  public_content(
    @Session('profile_id') profile_id: string,
    @Param('username') username: string,
    @Query() pagination: PaginationQuery,
    @Query('type') type?: 'all' | 'multimedia',
    @Query('media_type') media_type?: 'all' | 'image' | 'video',
  ) {
    type = type ?? 'all';
    media_type = media_type ?? 'all';
    return this.queryBus.execute(
      new ProfileContentQuery(
        profile_id,
        username,
        pagination,
        type,
        media_type,
      ),
    );
  }

  @Get('collection')
  collection_content() {
    throw new NotImplementedException();
  }

  @Get('favorite')
  favorite_content(
    @Session('profile_id') profile_id: string,
    @Query() pagination: PaginationQuery,
  ) {
    return this.queryBus.execute(
      new FavoriteContentQuery(profile_id, pagination),
    );
  }

  @Post('pin/:publication_id')
  pin_publication(
    @Session('profile_id') profile_id: string,
    @Param('publication_id') publication_id: string,
  ) {
    return this.commandBus.execute(
      new PinPublicationCommand(profile_id, publication_id),
    );
  }

  @Delete('pin/:publication_id')
  unpin_publication(
    @Session('profile_id') profile_id: string,
    @Param('publication_id') publication_id: string,
  ) {
    return this.commandBus.execute(
      new UnpinPublicationCommand(profile_id, publication_id),
    );
  }
}
