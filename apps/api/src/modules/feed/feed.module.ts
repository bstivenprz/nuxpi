import { DynamicModule, Module } from '@nestjs/common';
import { join } from 'path';

import { DynamicProviderInjection } from '@/common/utils/dynamic-provider-injection.provider';
import { FeedController } from './controllers/feed.controller';

@Module({})
export class FeedModule {
  static forRoot(): DynamicModule {
    const handlers = DynamicProviderInjection.injectHandlers(
      join(__dirname, './'),
    );

    return {
      module: FeedModule,
      controllers: [FeedController],
      providers: [...handlers],
    };
  }
}
