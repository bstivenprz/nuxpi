import { Configuration, Value } from '@itgorillaz/configify';
import { LoggerOptions } from 'typeorm';

@Configuration()
export class DatabaseConfig {
  @Value('DB_TYPE', { default: 'postgres' })
  type: 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mongodb';

  @Value('DB_HOST', { default: 'localhost' })
  host: string;

  @Value('DB_PORT', { default: 5432 })
  port: number;

  @Value('DB_USERNAME', { default: 'postgres' })
  username: string;

  @Value('DB_PASSWORD', { default: 'postgres' })
  password: string;

  @Value('DB_NAME', { default: 'default_app_database' })
  database: string;

  @Value('DB_LOGGING', { default: false })
  logging: LoggerOptions;

  @Value('DB_SYNCHRONIZE', { default: false })
  synchronize: boolean;
}
