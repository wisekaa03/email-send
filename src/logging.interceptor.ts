import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  Inject,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ContextType,
} from '@nestjs/common';
import { GqlExecutionContext, GraphQLExecutionContext } from '@nestjs/graphql';
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GraphQLContext } from '@shared/interfaces';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: WinstonLogger;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger: Logger,
  ) {
    this.logger = new WinstonLogger(this.winstonLogger);
    this.logger.setContext(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const type = context.getType<'graphql' | ContextType>();

    switch (type) {
      case 'rpc':
        const info = context.switchToRpc().getContext();

        return next
          .handle()
          .pipe(tap(() => this.logger.log({ info: info.args })));

      case 'graphql':
      default: {
        const ctx: GraphQLExecutionContext =
          GqlExecutionContext.create(context);
        const resolverName = ctx.getClass().name;
        const info = ctx.getInfo();
        const gqlCtx = ctx.getContext<GraphQLContext>();
        const values = ctx.getArgs();
        const { headers } = gqlCtx.req;
        // const username = values.username
        //   ? values.username
        //   : gqlCtx.user?.username || '';
        const message = `Incoming GraphQL ${resolverName} ${info.operation.operation}: ${info.fieldName}`;

        if (values?.password) {
          values.password = '* MASKED *';
        }

        return next.handle().pipe(
          tap(() => {
            try {
              this.logger.log(
                {
                  message,
                  headers,
                  // username,
                  operation: info.operation.operation,
                  fieldName: info.fieldName,
                  values: `${
                    Object.keys(values).length > 0 ? JSON.stringify(values) : ''
                  }`,
                  function: context.getHandler().name,
                },
                resolverName,
              );
              // eslint-disable-next-line no-empty
            } catch {}
          }),
        );
      }
    }
  }
}
