import { DynamicModule, Module } from '@nestjs/common';
import { DynamicProviderInjection } from '@/common/utils/dynamic-provider-injection.provider';
import { join } from 'path';
import { WalletController } from './controllers/wallet.controller';
import { WalletMapper } from './wallet.mapper';

@Module({})
export class WalletModule {
  static forRoot(): DynamicModule {
    const handlers = DynamicProviderInjection.injectHandlers(
      join(__dirname, './'),
    );

    return {
      module: WalletModule,
      controllers: [WalletController],
      providers: [WalletMapper, ...handlers],
    };
  }
}
