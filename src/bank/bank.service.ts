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
      content: {
        type: 'interactive',
        recipient_type: 'individual',
        interactive: {
          type: 'button',
          body: {
            text: '🤗 Bem vinda ao Social Bank!',
          },
          footer: {
            text: 'Social Bank é apenas uma demo de um sistema bancário disponível no WhatsApp. Desenvolvido por @nathsouzadev',
          },
          action: {
            buttons: [
              {
                type: 'reply',
                reply: {
                  title: 'Ver saldo',
                  id: 'balance',
                },
              },
              {
                type: 'reply',
                reply: {
                  title: 'Ver extrato',
                  id: 'extract',
                },
              },
            ],
          },
        },
      },
    });
}
