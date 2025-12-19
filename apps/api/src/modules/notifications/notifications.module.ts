import { DynamicModule, Module } from '@nestjs/common';
import { DynamicProviderInjection } from '@/common/utils/dynamic-provider-injection.provider';
import { join } from 'path';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsMapper } from './notifications.mapper';

@Module({})
export class NotificationsModule {
  static forRoot(): DynamicModule {
    const handlers = DynamicProviderInjection.injectHandlers(
      join(__dirname, './'),
    );

    return {
      module: NotificationsModule,
      controllers: [NotificationsController],
      providers: [NotificationsMapper, ...handlers],
    };
  }
}
