import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class AppConfig {
  @Value('PORT', { default: 3000 })
  port: number;

  @Value('API_PREFIX', { default: 'api' })
  api_prefix: string;

  @Value('FRONTEND_URL', { default: 'http://localhost:3000' })
  frontend_url: string;
}
