import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetWalletBalanceQuery } from './get-wallet-balance.query';
import { Wallet } from '../entities/wallet.entity';
import { Exception } from '@/common/models/http-exception';
import { WalletObject } from '../objects/wallet.object';

@QueryHandler(GetWalletBalanceQuery)
export class GetWalletBalanceQueryHandler
  implements IQueryHandler<GetWalletBalanceQuery, WalletObject>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: GetWalletBalanceQuery): Promise<WalletObject> {
    const { account_id } = query;

    const wallet = await Wallet.findOne({
      where: {
        account: {
          id: account_id,
        },
      },
      relations: {
        account: true,
      },
    });

    if (!wallet) throw Exception.NotFound('wallet_not_found');

    return this.mapper.map(wallet, Wallet, WalletObject);
  }
}
