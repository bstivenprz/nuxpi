import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class CloudinaryConfig {
  @Value('CLOUDINARY_CLOUD_NAME')
  cloud_name: string;

  @Value('CLOUDINARY_API_KEY')
  api_key: string;

  @Value('CLOUDINARY_API_SECRET')
  api_secret: string;

  @Value('CLOUDINARY_FOLDER', { default: 'nuxpi' })
  folder: string;
}
