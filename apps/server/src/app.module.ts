import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConnectionModule } from './connection/connection.module';
import { CompanyModule } from './company/company.module';
import { PrismaModule } from './prisma/prisma.module';
import { JobModule } from './job/job.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                  translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                  ignore: 'pid,hostname',
                  messageFormat: '[{req.id}] {req.method} {req.url} - {msg}  {res.statusCode} {responseTime}ms',
                },
              }
            : undefined,
        redact: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.body.password',
          'req.body.oldPassword',
          'req.body.newPassword',
          'req.body.token',
          'req.body.otp',
        ],
        autoLogging: true,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
      },
    }),
    AuthModule,
    UserModule,
    ConnectionModule,
    CompanyModule,
    PrismaModule,
    JobModule,
    PostModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 3, // 3 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 20, // 20 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
  ],

  controllers: [AppController],
  providers: [
    AppService,
    // Apply ThrottlerGuard globally to all routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
