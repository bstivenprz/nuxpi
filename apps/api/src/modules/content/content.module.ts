import { DynamicModule, Module } from '@nestjs/common';
import { DynamicProviderInjection } from '@/common/utils/dynamic-provider-injection.provider';
import { join } from 'path';
import { PublicationsController } from './controllers/publications.controller';
import { AssetsController } from './controllers/assets.controller';
import { ContentMapper } from './content.mapper';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import Redis from 'ioredis';
import { RedisConfig } from '@/config/redis.config';

@Module({})
export class ContentModule {
  static forRoot(): DynamicModule {
    const handlers = DynamicProviderInjection.injectHandlers(
      join(__dirname, './'),
    );

    return {
      module: ContentModule,
      imports: [
        {
          
        }
      ],
      controllers: [PublicationsController, AssetsController],
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: (config: RedisConfig) => {
            return new Redis({
              host: config.host,
              port: config.port,
              password: config.password,
            });
          },
        },
        CloudinaryService,
        ContentMapper,
        ...handlers,
      ],
    };
  }
}
