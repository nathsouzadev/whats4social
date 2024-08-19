import { ButtonData } from 'src/resources/clients/social/model/whats-message.model';

const content = (data: {
  type: string;
  text: string;
  buttons?: ButtonData[];
}) => {
  const { type, text, buttons } = data;

  return {
    type,
    recipient_type: 'individual',
    interactive: {
      type: 'button',
      body: {
        text: `${text} \nEscolha uma opção abaixo:`,
      },
      footer: {
        text: 'Social Bank é uma demo. Desenvolvido por @nathsouzadev',
      },
      action: {
        buttons: buttons ?? [
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
              title: 'Fazer uma compra',
              id: 'purchase',
            },
          },
        ],
      },
    },
  };
};

export const CONTENT_BODY = {
  WELLCOME: content({
    type: 'interactive',
    text: '🤗 Bem vinda ao Social Bank!',
  }),
  BALANCE: content({
    type: 'interactive',
    text: '💰💵 Seu saldo é de R$ 1000,00',
  }),
  PURCHASE: content({
    type: 'interactive',
    text: '🛒🛍️ O que deseja comprar?',
    buttons: [
      {
        type: 'reply',
        reply: {
          title: '💻 PC R$ 2000.00',
          id: 'refused',
        },
      },
      {
        type: 'reply',
        reply: {
          title: '🖥️ Monitor R$ 500.00',
          id: 'completed',
        },
      },
    ],
  }),
  PURCHASE_COMPLETED: content({
    type: 'interactive',
    text: '🎉🎊 Compra realizada com sucesso!',
  }),
  PURCHASE_REFUSED: content({
    type: 'interactive',
    text: '❌🛒 Compra recusada!',
  }),
};
