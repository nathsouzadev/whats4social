import { Injectable } from '@nestjs/common';
import { SocialService } from '../../social/services/social.service';

@Injectable()
export class MessageService {
  constructor(private readonly socialService: SocialService) {}

  reply = async (data: {
    from: string;
    message: string;
    phoneNumberId: string;
  }) => this.socialService.reply(data);
}
