import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from 'nestjs-redis';

import { Email, EmailSchema } from './schemas';
import { DBService } from './services';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          uri: 'mongodb://mongo',
          user: configService.get('MONGO_INITDB_ROOT_USERNAME'),
          pass: configService.get('MONGO_INITDB_ROOT_PASSWORD'),
          dbName: 'email',
        };
      },
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([
      {
        name: Email.name,
        schema: EmailSchema,
        collection: 'email',
      },
    ]),

    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => [
        {
          name: 'email',
          host: configService.get('REDIS_HOST', 'redis'),
          port: configService.get('REDIS_PORT', 6379),
          db: 0,
          keyPrefix: 'EMAIL:',
        },
      ],
      inject: [ConfigService],
    }),
  ],

  providers: [Logger, DBService],

  exports: [DBService],
})
export class DbModule {}
