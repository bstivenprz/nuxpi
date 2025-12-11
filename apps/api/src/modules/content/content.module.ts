import { DynamicModule, Module } from '@nestjs/common';
import { DynamicProviderInjection } from '@/common/utils/dynamic-provider-injection.provider';
import { join } from 'path';
import { PublicationsController } from './controllers/publications.controller';
import { AssetsController } from './controllers/assets.controller';
import { ContentMapper } from './content.mapper';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';

@Module({})
export class ContentModule {
  static forRoot(): DynamicModule {
    const handlers = DynamicProviderInjection.injectHandlers(
      join(__dirname, './'),
    );

    return {
      module: ContentModule,
      controllers: [PublicationsController, AssetsController],
      providers: [CloudinaryService, ContentMapper, ...handlers],
    };
  }
}
