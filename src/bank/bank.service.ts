import { Injectable } from '@nestjs/common';
import { SocialService } from '../social/services/social.service';
import { BankMessageModel } from './model/message.model';
import { CONTENT_BODY } from './constants/content';

@Injectable()
export class BankService {
  constructor(private readonly socialService: SocialService) {}

  handle = async (data: BankMessageModel) =>
    this.socialService.replyToWhatsapp({
      ...data,
      message: '🤗 Bem vinda ao Social Bank!',
      service: 'bank',
      content: CONTENT_BODY.WELLCOME,
    });

  balance = () => 1000;
}
