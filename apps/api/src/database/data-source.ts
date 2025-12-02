import 'reflect-metadata';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: (process.env.DB_TYPE as any) ?? 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'db_development',
  logging: true,
  synchronize: true,
  entities: ['dist/modules/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/**/*{.ts,.js}'],
});
