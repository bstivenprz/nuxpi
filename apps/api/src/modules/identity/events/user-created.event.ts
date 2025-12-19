import { Account } from '@/modules/profile/entities/account.entity';
import { IEvent } from '@nestjs/cqrs';

export class UserCreatedEvent implements IEvent {
  constructor(readonly account: Account) {}
}
