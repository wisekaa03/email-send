import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EMAIL_STATE, EmailInput } from '@shared/graphql';
import {
  EMAIL_MICROSERVICE,
  EMAIL_MICROSERVICE_SEND,
} from '@shared/interfaces';
import { Email, EmailBody, EmailDocument } from '@db/schemas/email.schema';

@Injectable()
export class DBService {
  private logger: WinstonLogger;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger: Logger,
    @Inject(EMAIL_MICROSERVICE) private client: ClientProxy,
    @InjectModel(Email.name) private emailModel: Model<EmailDocument>,
  ) {
    this.logger = new WinstonLogger(this.winstonLogger);
    this.logger.setContext(DBService.name);
  }

  /**
   * Поиск по email id
   *
   * @async
   * @param {number} id ИД письма
   * @returns {EMAIL_STATE} Состояние письма
   */
  async verifyEmail({ id }: { id: string }): Promise<EmailDocument> {
    try {
      const email = await this.emailModel.findById(id);

      if (!email) {
        throw new Error('NOT FOUND');
      }

      email.id = email._id;
      return email;
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException();
    }
  }

  /**
   * Постановка в очередь
   *
   * @async
   * @param {EmailInput} params destination, subject, body - Поля email
   * @returns {EmailOutput} Зарегистрированный email
   */
  async queueEmail({
    params,
  }: {
    params: EmailInput;
  }): Promise<EmailDocument | null> {
    const create: EmailBody = {
      ...params,
      state: EMAIL_STATE.PROCEED,
    };
    const email = new this.emailModel(create);
    const emailDocument = await email.save();

    await this.client
      .emit(EMAIL_MICROSERVICE_SEND, {
        ...emailDocument,
        body: params.body,
      })
      .toPromise();
    return email;
  }
}
