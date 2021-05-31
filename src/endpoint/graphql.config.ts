import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GqlOptionsFactory,
  GqlModuleOptions,
  registerEnumType,
} from '@nestjs/graphql';
import { EMAIL_STATE } from '@shared/graphql';

@Injectable()
export class GraphQLConfigService implements GqlOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createGqlOptions(): GqlModuleOptions {
    const maxFileSize = this.configService.get<number>(
      'MAX_FILE_SIZE',
      100000000,
    );

    registerEnumType(EMAIL_STATE, {
      name: 'EMAIL_STATE',
      description: 'Состояние',
    });

    return {
      autoSchemaFile: true,
      tracing: process.env.NODE_ENV === 'development',
      debug: process.env.NODE_ENV === 'development',
      introspection: process.env.NODE_ENV === 'development',
      playground:
        process.env.NODE_ENV === 'development'
          ? {
              settings: {
                'request.credentials': 'same-origin',
              },
            }
          : false,
      // typePaths: ['./**/*.graphql'],
      cors: {
        // origin: 'https://localhost:4000',
        credentials: true,
      },
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
      uploads: { maxFileSize },
    };
  }
}
