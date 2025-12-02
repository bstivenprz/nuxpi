import { DynamicProviderInjection } from '@/common/utils/dynamic-provider-injection.provider';
import { DynamicModule, Module } from '@nestjs/common';
import { IdentityController } from './controllers/identity.controller';
import { join } from 'path';
import { SupabaseModule } from '@/services/supabase/supabase.module';

@Module({})
export class IdentityModule {
  static forRoot(): DynamicModule {
    const providers = DynamicProviderInjection.injectHandlers(
      join(__dirname, './'),
    );

    return {
      module: IdentityModule,
      imports: [SupabaseModule],
      controllers: [IdentityController],
      providers,
    };
  }
}
