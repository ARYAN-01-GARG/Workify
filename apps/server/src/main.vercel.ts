import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { Logger } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { AppModule } from './app.module';
import { config } from './common/config';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

export default async function (req: any, res: any) {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: config.urls.cors,
    credentials: true,
  });

  // Request ID middleware for log correlation
  app.use((req: any, res: any, next: () => void) => {
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();
    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return {
          message: 'Validation failed',
          errors: errors.map((err) => ({
            field: err.property,
            constraints: err.constraints,
          })),
        };
      },
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    })
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(Logger)));
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.setGlobalPrefix('api');

  // Swagger (Optional: might be slow on startup, can be removed if not needed in prod)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Workify API')
    .setDescription('Workify - Job Board & Professional Networking Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // Initialize the app but DO NOT listen
  await app.init();

  // Create an Express adapter to handle the request
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
}
