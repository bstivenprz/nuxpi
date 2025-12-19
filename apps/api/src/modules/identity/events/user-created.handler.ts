import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { UserCreatedEvent } from './user-created.event';
import { Wallet } from '@/modules/wallet/entities/wallet.entity';
import { Account } from '@/modules/profile/entities/account.entity';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  private logger = new Logger(UserCreatedEventHandler.name);

  constructor() {}

  async handle(event: UserCreatedEvent) {
    try {
      this.logger.log(`Handling event: ${UserCreatedEvent.name}`);
      const { account } = event;
      await this.createWallet(account);
    } catch (error) {
      this.logger.error(
        `Error handling event: ${UserCreatedEvent.name}`,
        error,
      );
    }
  }

  private async createWallet(account: Account) {
    const wallet = new Wallet({
      account,
    });

    await wallet.save();
  }
}
