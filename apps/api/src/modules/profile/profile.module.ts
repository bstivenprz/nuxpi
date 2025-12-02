import { DynamicModule, Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile.controller';
import { DynamicProviderInjection } from '@/common/utils/dynamic-provider-injection.provider';
import { join } from 'path';
import { ProfileMapper } from './profile.mapper';

@Module({})
export class ProfileModule {
  static forRoot(): DynamicModule {
    const handlers = DynamicProviderInjection.injectHandlers(
      join(__dirname, './'),
    );

    return {
      module: ProfileModule,
      controllers: [ProfileController],
      providers: [ProfileMapper, ...handlers],
    };
  }
}
