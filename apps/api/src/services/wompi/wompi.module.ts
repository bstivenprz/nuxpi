import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';

import { WompiService } from './wompi.service';
import { WompiConfig } from '@/config/wompi.config';

@Module({})
export class WompiModule {
  static forRoot(): DynamicModule {
    return {
      module: WompiModule,
      imports: [
        HttpModule.registerAsync({
          useFactory: (config: WompiConfig) => ({
            baseURL: config.baseUrl,
            headers: {
              Authorization: `Bearer ${config.publicKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 5000,
          }),
        }),
      ],
      providers: [
        {
          provide: 'WOMPI_MODULE_OPTIONS',
          useFactory: (config: WompiConfig): WompiConfig => ({
            baseUrl: config.baseUrl,
            publicKey: config.publicKey,
            privateKey: config.privateKey,
            eventsKey: config.eventsKey,
            integrationKey: config.integrationKey,
          }),
          inject: [WompiConfig],
        },
        WompiService,
      ],
      exports: [WompiService],
    };
  }
}
