import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';

import { EMAIL_MICROSERVICE } from '@shared/interfaces';
import { Email, EmailSchema } from './schemas';
import { DBService } from './services';

@Module({
  imports: [
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

    ClientsModule.register([
      {
        name: EMAIL_MICROSERVICE,
        transport: Transport.REDIS,
        options: {
          url: 'redis://redis:6379',
        },
      },
    ]),
  ],

  providers: [Logger, DBService],

  exports: [DBService],
})
export class DbModule {}
