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

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseProvider,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    CqrsModule.forRoot(),
    AuthModule,
    IdentityModule.forRoot(),
    ProfileModule.forRoot(),
    FeedModule.forRoot(),
    ChatModule.forRoot(),
  ],
})
export class AppModule {}
