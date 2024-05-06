import { Injectable, Logger } from '@nestjs/common';
import { SocialService } from '../../social/services/social.service';
import { WBPayloadEntry } from '../models/meta-message.model';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(private readonly socialService: SocialService) {}

  reply = async (data: {
    from: string;
    message: string;
    phoneNumberId: string;
  }) => this.socialService.reply(data);

  handleMessage = async(data: WBPayloadEntry[]) => {
    if(Object.keys(data[0].changes[0].value).includes('messages')) {
      const message = data[0].changes[0]?.value?.['messages'][0];
    
      if(message?.type === 'text' && message?.text?.body !== 'teste') {
        await this.reply({
          from: message.from,
          message: message.text.body,
          phoneNumberId: data[0].changes[0].value.metadata.phone_number_id
        });
      }
    }
  }
}
