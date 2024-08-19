import { Injectable, Logger } from '@nestjs/common';
import { SocialService } from '../../../clients/social/services/social.service';
import { WBPayloadEntry } from '../models/meta-message.model';
import { ConfigService } from '@nestjs/config';
import { BankService } from '../../../../bank/bank.service';
import { MessageWireIn } from '../models/message.wire-in.model';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private configService: ConfigService,
    private readonly socialService: SocialService,
    private readonly bankService: BankService,
  ) {}

  private validatePost = (data: {
    type: string;
    phoneNumber: string;
    message: string;
  }): boolean =>
    data.type === 'text' &&
    data.phoneNumber === this.configService.get('wb.phoneNumber') &&
    data.message !== '/bank';

  reply = async (data: {
    from: string;
    message: string;
    phoneNumberId: string;
  }) =>
    this.socialService.replyToWhatsapp({
      ...data,
      service: 'message',
    });

  handleMessage = async (data: MessageWireIn) => {
    try {
      const { from, message, phoneNumberId, type } = data;
      if (
        this.validatePost({
          type: type,
          phoneNumber: from,
          message: message,
        })
      ) {
        await this.reply({
          from: from,
          message: message,
          phoneNumberId: phoneNumberId,
        });
      }
  
      // this.bankService.handle({
      //   from: message.from,
      //   phoneNumberId: data[0].changes[0].value.metadata.phone_number_id,
      //   contentReply: message[message.type],
      // });
    } catch (error) {
      return;
    }
  };
}
