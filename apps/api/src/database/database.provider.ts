import { DatabaseConfig } from '@/config/database.config';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseProvider implements TypeOrmOptionsFactory {
  constructor(private readonly config: DatabaseConfig) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.config.type,
      host: this.config.host,
      port: this.config.port,
      username: this.config.username,
      password: this.config.password,
      database: this.config.database,
      logging: this.config.logging,
      synchronize: this.config.synchronize,
      entities: ['dist/modules/**/*.entity{.ts,.js}'],
      migrations: ['dist/database/migrations/**/*{.ts,.js}'],
    };
  }
}
