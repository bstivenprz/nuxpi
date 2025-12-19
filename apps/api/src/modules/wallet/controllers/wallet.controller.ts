import { Session } from '@/auth/decorators/session.decorator';
import { Controller, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetWalletBalanceQuery } from '../queries/get-wallet-balance.query';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('balance')
  balance(@Session('account_id') account_id: string) {
    return this.queryBus.execute(new GetWalletBalanceQuery(account_id));
  }
}
