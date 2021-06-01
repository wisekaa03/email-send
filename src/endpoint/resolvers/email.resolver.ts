import { Inject } from '@nestjs/common';
import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { DBService } from '@db/services/db.service';
import { Email, EmailDocument } from '@db/schemas/email.schema';

@Resolver()
export class EmailResolver {
  private logger: WinstonLogger;

  constructor(
    private readonly dbService: DBService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger: Logger,
  ) {
    this.logger = new WinstonLogger(this.winstonLogger);
    this.logger.setContext(EmailResolver.name);
  }

  @Query(() => Email)
  async verifyEmail(
    @Args('id')
    id: string,
  ): Promise<EmailDocument | null> {
    return this.dbService.verifyEmail({ id });
  }

  @Mutation(() => Email)
  async queueEmail(
    @Args('destination')
    destination: string,
    @Args('subject')
    subject: string,
    @Args('body')
    body: string,
  ): Promise<EmailDocument | null> {
    return this.dbService.queueEmail({
      params: {
        destination,
        subject,
        body,
      },
    });
  }
}
