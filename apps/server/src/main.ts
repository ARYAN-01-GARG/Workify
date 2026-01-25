import { writeFileSync } from 'node:fs';
import { BadRequestException, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { Logger } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { AppModule } from './app.module';
import { config } from './common/config';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: config.urls.cors,
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
        return new BadRequestException({
          message: 'Validation failed',
          errors: errors.map((err) => ({
            field: err.property,
            constraints: err.constraints,
          })),
        });
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Workify API')
    .setDescription('Workify - Job Board & Professional Networking Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  writeFileSync('./swagger-spec.json', JSON.stringify(document));

  await app.listen(config.port, config.host);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
