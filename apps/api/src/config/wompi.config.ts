import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class WompiConfig {
  @Value('WOMPI_BASE_URL')
  baseUrl: string;

  @Value('WOMPI_PUBLIC_KEY')
  publicKey: string;

  @Value('WOMPI_PRIVATE_KEY')
  privateKey: string;

  @Value('WOMPI_EVENTS_KEY')
  eventsKey: string;

  @Value('WOMPI_INTEGRATION_KEY')
  integrationKey: string;
}
