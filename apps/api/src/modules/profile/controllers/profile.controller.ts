import { Session } from '@/auth/decorators/session.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetProfileQuery } from '../queries/get-profile.query';
import { GetPublicProfileQuery } from '../queries/get-public-profile.query';
import { FollowersQuery } from '../queries/followers.query';
import { PaginationQuery } from '@/common/models/pagination';
import { FollowCommand } from '../commands/follow.command';
import { UnfollowCommand } from '../commands/unfollow.command';
import { UpdateProfileCommand } from '../commands/update-profile.command';
import { ProfileObject } from '../objects/profile.object';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  get(@Session('profile_id') profile_id: string) {
    return this.queryBus.execute(new GetProfileQuery(profile_id));
  }

  @Patch()
  update(
    @Session('profile_id') profile_id: string,
    @Body() body: Partial<ProfileObject>,
  ) {
    return this.commandBus.execute(new UpdateProfileCommand(profile_id, body));
  }

  @Delete('/cover')
  removeCoverImage(@Session('profile_id') profile_id: string) {
    return this.commandBus.execute(
      new UpdateProfileCommand(profile_id, { cover: null }),
    );
  }

  @Delete('/picture')
  removePictureImage(@Session('profile_id') profile_id: string) {
    return this.commandBus.execute(
      new UpdateProfileCommand(profile_id, { picture: null }),
    );
  }

  @Get(':username')
  public(
    @Session('username') current_username: string | undefined,
    @Param('username') username: string,
  ) {
    return this.queryBus.execute(
      new GetPublicProfileQuery(current_username, username),
    );
  }

  @Get(':username/followers')
  followers(
    @Session('profile_id') profile_id: string,
    @Param('username') username: string,
    @Query() pagination: PaginationQuery,
  ) {
    return this.queryBus.execute(
      new FollowersQuery(profile_id, username, pagination),
    );
  }

  @Post(':username/follow')
  follow(
    @Session('profile_id') profile_id: string,
    @Param('username') username: string,
  ) {
    return this.commandBus.execute(new FollowCommand(profile_id, username));
  }

  @Delete(':username/follow')
  unfollow(
    @Session('profile_id') profile_id: string,
    @Param('username') username: string,
  ) {
    return this.commandBus.execute(new UnfollowCommand(profile_id, username));
  }
}
