import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class SupabaseConfig {
  @Value('SUPABASE_URL')
  url: string;

  @Value('SUPABASE_ANON_KEY')
  anon_key: string;

  @Value('SUPABASE_SERVICE_KEY')
  service_key: string;

  @Value('SUPABASE_JWKS_URL')
  jwks_url: string;

  @Value('SUPABASE_JWT_ISSUER')
  jwt_issuer: string;

  @Value('SUPABASE_COOKIE_NAME')
  cookie_name: string;
}
