import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { WinstonModule, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { createWinstonOptions } from '@shared/createWinstonOptions';
import { AppModule } from './app.module';
import { version } from '../package.json';

const LogContext = 'Bootstrap';

(async () => {
  let logger = WinstonModule.createLogger(createWinstonOptions());

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      credentials: true,
    },
    logger,
  });

  logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  await app.listen(port);

  logger.log(
    `Server version ${version} started at localhost:${port}`,
    LogContext,
  );

  // #region Webpack-HMR
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(async () => app.close());
  }
  // #endregion
})();
