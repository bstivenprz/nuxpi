import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import validationOptions from './common/utils/validation-options';
import { ResolvePromisesInterceptor } from './common/utils/serializer.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.disable('x-powered-by');

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3001', 'https://nuxpi.com'],
    credentials: true,
  });

  app.enableShutdownHooks();
  app.setGlobalPrefix('api', { exclude: ['/'] });

  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder().addCookieAuth('acc').build(),
    ),
    {
      swaggerOptions: {
        withCredentials: true,
        persistAuthorization: true,
      },
    },
  );

  await app.listen(3000);
}
bootstrap();
