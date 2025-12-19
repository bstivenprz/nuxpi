import { IQuery } from '@nestjs/cqrs';

export class GetWalletBalanceQuery implements IQuery {
  constructor(readonly account_id: string) {}
}
