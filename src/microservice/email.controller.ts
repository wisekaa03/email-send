import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EMAIL_MICROSERVICE_SEND } from '@shared/interfaces';
import { EmailFull } from '@db/schemas/email.schema';

@Controller()
export class EmailSender {
  @MessagePattern(EMAIL_MICROSERVICE_SEND)
  async emailSend(email: EmailFull) {
    debugger;
  }
}
