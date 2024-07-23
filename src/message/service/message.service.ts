import { Injectable, Logger } from '@nestjs/common';
import { SocialService } from '../../social/services/social.service';
import { WBPayloadEntry } from '../models/meta-message.model';
import { ConfigService } from '@nestjs/config';
import { BankService } from '../../bank/bank.service';

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

  handleMessage = async (data: WBPayloadEntry[]) => {
    if (Object.keys(data[0].changes[0].value).includes('messages')) {
      const message = data[0].changes[0]?.value?.['messages'][0];

      if (
        Object.keys(message).includes('text') &&
        this.validatePost({
          type: message?.type,
          phoneNumber: message.from,
          message: message.text.body,
        })
      ) {
        await this.reply({
          from: message.from,
          message: message.text.body,
          phoneNumberId: data[0].changes[0].value.metadata.phone_number_id,
        });

        return;
      }

      this.bankService.handle({
        from: message.from,
        phoneNumberId: data[0].changes[0].value.metadata.phone_number_id,
        contentReply: message[message.type],
      });
    }
  };
}
