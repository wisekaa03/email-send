import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';

import { createWinstonOptions } from '@shared/createWinstonOptions';
import { Email, EmailSchema } from '@db/schemas/email.schema';
import { EmailSender } from './email.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.local/.env' }),
    WinstonModule.forRoot(createWinstonOptions()),

    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: 'mongodb://mongo',
        user: configService.get('MONGO_INITDB_ROOT_USERNAME'),
        pass: configService.get('MONGO_INITDB_ROOT_PASSWORD'),
        dbName: 'email',
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([
      {
        name: Email.name,
        schema: EmailSchema,
      },
    ]),
  ],
  controllers: [EmailSender],
  providers: [],
})
export class AppModule {}
