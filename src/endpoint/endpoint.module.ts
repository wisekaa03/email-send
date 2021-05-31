import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { DbModule } from '@db/db.module';

import { GraphQLConfigService } from './graphql.config';
import { EmailResolver } from './resolvers';

@Module({
  imports: [
    DbModule,

    GraphQLModule.forRootAsync({
      inject: [ConfigService],
      useClass: GraphQLConfigService,
    }),
  ],

  providers: [Logger, EmailResolver],
})
export class EndpointModule {}
