import { Injectable, Logger } from '@nestjs/common';
import { SocialService } from '../../social/services/social.service';
import { WBPayloadEntry } from '../models/meta-message.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private configService: ConfigService,
    private readonly socialService: SocialService
  ) {}

  reply = async (data: {
    from: string;
    message: string;
    phoneNumberId: string;
  }) => this.socialService.replyToWhatsapp(data);

  handleMessage = async(data: WBPayloadEntry[]) => {
    if(Object.keys(data[0].changes[0].value).includes('messages')) {
      const message = data[0].changes[0]?.value?.['messages'][0];
    
      if(message?.type === 'text' && message.from === this.configService.get('wb.phoneNumber')) {
        await this.reply({
          from: message.from,
          message: message.text.body,
          phoneNumberId: data[0].changes[0].value.metadata.phone_number_id
        });

        return;
      }
    }
  }
}
