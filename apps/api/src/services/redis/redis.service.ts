import { RedisConfig } from '@/config/redis.config';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  readonly client: Redis;

  constructor(private config: RedisConfig) {
    this.client = new Redis({
      host: this.config.host,
      port: this.config.port,
      password: this.config.password,
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis error', error);
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connected');
    });

    this.client.on('reconnecting', () => {
      this.logger.log('Redis reconnecting');
    });

    this.client.on('ready', () => {
      this.logger.log('Redis ready');
    });
  }

  async onModuleDestroy() {
    this.logger.log('Redis module destroyed');
    await this.client.quit();
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) > 0;
  }

  async expire(key: string, seconds: number): Promise<number> {
    return await this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.client.keys(pattern);
  }

  async flusdb(): Promise<'OK'> {
    return await this.client.flushdb();
  }
}
