import { Injectable } from '@nestjs/common';
import { SocialService } from '../social/services/social.service';
import { BankMessageModel } from './model/message.model';

@Injectable()
export class BankService {
  constructor(private readonly socialService: SocialService) {}

  handle = async (data: BankMessageModel) =>
    this.socialService.replyToWhatsapp({
      ...data,
      message: '🤗 Bem vinda ao Social Bank!',
      service: 'bank',
    });
}
