import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseProvider } from '@/database/database.provider';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from './auth/auth.module';
import { IdentityModule } from './modules/identity/identity.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ChatModule } from './modules/chat/chat.module';
import { FeedModule } from './modules/feed/feed.module';
import { BullModule } from '@nestjs/bull';
import { RedisConfig } from './config/redis.config';
import { ContentModule } from './modules/content/content.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseProvider,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    BullModule.forRootAsync({
      imports: [RedisConfig],
      useFactory: async (config: RedisConfig) => ({
        redis: {
          host: config.host,
          port: config.port,
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: 100,
          removeOnFail: 500,
        },
      }),
      inject: [RedisConfig],
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    CqrsModule.forRoot(),
    AuthModule,
    IdentityModule.forRoot(),
    ProfileModule.forRoot(),
    ContentModule.forRoot(),
    FeedModule.forRoot(),
    ChatModule.forRoot(),
  ],
})
export class AppModule {}
