import { IQuery } from '@nestjs/cqrs';

export class FindConversationQuery implements IQuery {
  constructor(
    readonly current_profile_id: string,
    readonly username: string,
  ) {}
}
