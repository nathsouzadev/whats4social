import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageWireIn } from '../models/message.wire-in.model';
import { SocialService } from '../../social/services/social.service';
import { AudioService } from '../../audio/audio.service';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private configService: ConfigService,
    private readonly socialService: SocialService,
    private readonly audioService: AudioService,
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

  handleMessage = async (data: MessageWireIn): Promise<void> => {
    try {
      const { from, message, phoneNumberId, type } = data;

      if (type !== 'text') {
        this.audioService.get(message);
        return;
      }

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
    } catch (error) {
      return;
    }
  };
}
