import { resolve as resolvePath } from 'path';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { google } from 'googleapis';
import { encode } from 'js-base64';

import { Email, EmailBody, EmailDocument } from '@db/schemas/email.schema';
import { EMAIL_STATE } from '../shared/graphql/email.state';

const scopes = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
];

@Injectable()
export class EmailService {
  private logger: WinstonLogger;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger: Logger,
    @InjectModel(Email.name) private emailModel: Model<EmailDocument>,
    private configService: ConfigService,
  ) {
    this.logger = new WinstonLogger(this.winstonLogger);
    this.logger.setContext(EmailService.name);
  }

  makeMessage({
    to,
    from,
    subject,
    body,
  }: {
    to: string;
    from: string;
    subject: string;
    body: string;
  }): string {
    const str = [
      'Content-Type: text/html; charset="UTF-8"\n',
      'MIME-Version: 1.0\n',
      'Content-Transfer-Encoding: 7bit\n',
      'to: ',
      to,
      '\n',
      'from: ',
      from,
      '\n',
      'subject: ',
      subject,
      '\n\n',
      body,
    ].join('');

    return encode(str, true);
  }

  async sendMessage(email: EmailBody) {
    const auth = new google.auth.GoogleAuth({
      keyFile: resolvePath(__dirname, '../../.local/token.json'),
      scopes,
    });
    google.options({ auth });
    // const token = await auth.getAccessToken();

    const gmail = google.gmail({
      auth,
      version: 'v1',
    });

    const raw = this.makeMessage({
      to: email.destination,
      from: 'me',
      subject: email.subject,
      body: email.body,
    });

    return gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw,
      },
    });
  }

  async emailSend(email: EmailBody): Promise<boolean> {
    const result = await this.sendMessage(email).catch((error) => {
      this.logger.error(error);
      throw error;
    });
    this.logger.log(`Google GMail: ${result}`);

    await this.emailModel.findByIdAndUpdate({
      id: email.id,
      state: EMAIL_STATE.OK,
    });

    return true;
  }
}
