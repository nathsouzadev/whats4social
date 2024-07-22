import { ButtonData } from '../../social/model/whats-message.model';

const content = (data: {
  type: string;
  text: string;
  footerText: string;
  buttons: ButtonData[];
}) => {
  const { type, text, footerText, buttons } = data;

  return {
    type,
    recipient_type: 'individual',
    interactive: {
      type: 'button',
      body: {
        text,
      },
      footer: {
        text: footerText,
      },
      action: {
        buttons,
      },
    },
  };
};

export const CONTENT_BODY = {
  WELLCOME: content({
    type: 'interactive',
    text: '🤗 Bem vinda ao Social Bank! Como posso ajudar?',
    footerText: 'Social Bank é uma demo. Desenvolvido por @nathsouzadev',
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
          title: 'Transferência',
          id: 'transfer',
        },
      },
      {
        type: 'reply',
        reply: {
          title: 'Fazer uma compra',
          id: 'purchase',
        },
      },
    ],
  }),
};
