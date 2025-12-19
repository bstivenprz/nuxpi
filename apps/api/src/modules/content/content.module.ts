import { DynamicModule, Module } from '@nestjs/common';
import { DynamicProviderInjection } from '@/common/utils/dynamic-provider-injection.provider';
import { join } from 'path';
import { PublicationsController } from './controllers/publications.controller';
import { AssetsController } from './controllers/assets.controller';
import { ContentMapper } from './content.mapper';
import { RedisModule } from '@/services/redis/redis.module';
import { EngagementRankerService } from './services/engagement';
import { CleanUpFeedTask } from './tasks/cleanup-feed.task';
import { DiscoverController } from './controllers/discover.controller';
import { ContentProfileController } from './controllers/profile.controller';
import { CloudinaryModule } from '@/services/cloudinary/cloudinary.module';

@Module({})
export class ContentModule {
  static forRoot(): DynamicModule {
    const handlers = DynamicProviderInjection.injectHandlers(
      join(__dirname, './'),
    );

    return {
      module: ContentModule,
      imports: [RedisModule, CloudinaryModule],
      controllers: [
        PublicationsController,
        AssetsController,
        DiscoverController,
        ContentProfileController,
      ],
      providers: [
        EngagementRankerService,
        CleanUpFeedTask,
        ContentMapper,
        ...handlers,
      ],
    };
  }
}
