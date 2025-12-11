import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class RedisConfig {
  @Value('REDIS_HOST', { default: 'localhost' })
  host: string;

  @Value('REDIS_PORT', { default: 6379 })
  port: number;

  @Value('REDIS_PASSWORD')
  password: string;
}
