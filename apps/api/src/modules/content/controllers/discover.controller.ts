import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { DiscoverCreatorsQuery } from '../queries/discover-creators.query';
import { DiscoverProfilesQuery } from '../queries/discover-profiles.query';
import { DiscoverContentQuery } from '../queries/discover-content.query';
import { PaginationQuery } from '@/common/models/pagination';
import { Session } from '@/auth/decorators/session.decorator';

@Controller('discover')
export class DiscoverController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('creators')
  creators(@Session('profile_id') profile_id: string) {
    return this.queryBus.execute(new DiscoverCreatorsQuery(profile_id));
  }

  @Get('profiles')
  profiles(@Session('profile_id') profile_id: string) {
    return this.queryBus.execute(new DiscoverProfilesQuery(profile_id));
  }

  @Get('content')
  content(
    @Session('profile_id') profile_id: string,
    @Query() pagination: PaginationQuery,
  ) {
    return this.queryBus.execute(
      new DiscoverContentQuery(profile_id, pagination),
    );
  }
}
