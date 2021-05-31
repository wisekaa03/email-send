import {
  Inject,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import IORedis from 'ioredis';
import { RedisService } from 'nestjs-redis';
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EmailInput } from '@shared/graphql';
import { Email, EmailDocument } from '@db/schemas/email.schema';

@Injectable()
export class DBService {
  private logger: WinstonLogger;
  private redisClient: IORedis.Redis;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger: Logger,
    private readonly redisService: RedisService,
    @InjectModel(Email.name) private emailModel: Model<EmailDocument>,
  ) {
    this.logger = new WinstonLogger(this.winstonLogger);
    this.logger.setContext(DBService.name);
    this.redisClient = redisService.getClient('email');
  }

  /**
   * Поиск по email id
   *
   * @async
   * @param {number} id ИД письма
   * @returns {EMAIL_STATE} Состояние письма
   */
  async verifyEmail({ id }: { id: number }): Promise<EmailDocument> {
    try {
      const email = await this.emailModel.findById(id).exec();

      if (!email) {
        throw new Error('NOT FOUND');
      }

      email.id = email._id;
      return email;
    } catch (error) {
      this.logger.error(error);
      throw error;
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
    throw new PreconditionFailedException();
  }
}
