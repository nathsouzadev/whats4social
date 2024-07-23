import { Injectable } from '@nestjs/common';
import { SocialService } from '../social/services/social.service';
import { BankMessageModel } from './model/message.model';
import { CONTENT_BODY } from './constants/content';

@Injectable()
export class BankService {
  constructor(private readonly socialService: SocialService) {}

  handle = async (data: BankMessageModel) => {
    if (Object.keys(data.contentReply).includes('button_reply')) {
      const content = (() => {
        switch (data.contentReply['button_reply'].id) {
          case 'balance':
            return {
              message: `Seu saldo é de R$ 1000,00`,
              content: CONTENT_BODY.BALANCE,
            };
          case 'purchase': {
            return {
              message: 'Escolha um item que deseja comprar',
              content: CONTENT_BODY.PURCHASE,
            };
          }
          case 'completed': {
            return {
              message: 'Compra realizada com sucesso',
              content: CONTENT_BODY.PURCHASE_COMPLETED,
            };
          }
          case 'refused': {
            return {
              message: 'Compra recusada',
              content: CONTENT_BODY.PURCHASE_REFUSED,
            };
          }
        }
      })();

      return this.socialService.replyToWhatsapp({
        ...data,
        service: 'bank',
        ...content,
      });
    }

    return this.socialService.replyToWhatsapp({
      ...data,
      message: '🤗 Bem vinda ao Social Bank!',
      service: 'bank',
      content: CONTENT_BODY.WELLCOME,
    });
  };

  balance = () => 1000;
}
