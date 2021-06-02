import { Controller, NotAcceptableException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { EMAIL_MICROSERVICE_SEND } from '@shared/interfaces';
import { EmailBody } from '@db/schemas/email.schema';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  constructor(private emailService: EmailService) {}

  @MessagePattern(EMAIL_MICROSERVICE_SEND)
  async emailSend(email: EmailBody): Promise<boolean> {
    if (email.state && email.subject && email.destination) {
      return this.emailService.emailSend(email).catch(() => false);
    }

    throw new NotAcceptableException();
  }
}
