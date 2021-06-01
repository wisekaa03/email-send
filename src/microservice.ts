import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WinstonModule, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { createWinstonOptions } from '@shared/createWinstonOptions';
import { AppModule } from './microservice/app.module';
import { version } from '../package.json';

const LogContext = 'Bootstrap';

(async () => {
  let logger = WinstonModule.createLogger(createWinstonOptions());

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        url: 'redis://redis:6379',
      },
      logger,
    },
  );

  logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  app.listen(() =>
    logger.log(`Microservice is listening: ${version}`, LogContext),
  );

  // #region Webpack-HMR
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(async () => app.close());
  }
  // #endregion
})();
