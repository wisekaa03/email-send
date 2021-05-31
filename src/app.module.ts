import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

import { createWinstonOptions } from '@shared/createWinstonOptions';
import { DbModule } from './db/db.module';
import { EndpointModule } from './endpoint/endpoint.module';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.local/.env' }),
    WinstonModule.forRoot(createWinstonOptions()),

    DbModule,
    EndpointModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
