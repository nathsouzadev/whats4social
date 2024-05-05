import { Injectable, Logger } from '@nestjs/common';
import { SocialService } from '../../social/services/social.service';
import { MetaPayload } from '../models/meta-message.model';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(private readonly socialService: SocialService) {}

  reply = async (data: {
    from: string;
    message: string;
    phoneNumberId: string;
    valid: boolean;
  }) => this.socialService.reply(data);

  handleMessage = async(data: MetaPayload) => {
    const message = data.entry?.[0]?.changes[0]?.value?.['messages'][0];
    
    if(message?.type === 'text' && message?.text?.body !== 'teste') {
      const business_phone_number_id =
        data.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

      await this.reply({
        from: message.from,
        message: message.text.body,
        phoneNumberId: business_phone_number_id,
        valid: message?.type === 'text',
      });
    }
  }
}
