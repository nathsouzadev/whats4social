import { MetaMessageDTO } from '../../src/message/dto/meta-message.dto';

interface MockMetaMessage {
  sender: string;
  receiver: string;
  message: string;
  type: 'message' | 'status' | 'button';
  phoneNumberId?: string;
}

const messageTypes = {
  message: (data: MockMetaMessage) => ({
    contacts: [
      {
        profile: {
          name: 'NAME',
        },
        wa_id: data.receiver,
      },
    ],
    messages: [
      {
        from: data.sender,
        id: 'wamid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjU1MzE4NTYxRjk5NzI1MkEyRgA=',
        timestamp: Date.now(),
        text: {
          body: data.message,
        },
        type: 'text',
      },
    ],
  }),
  status: (data: MockMetaMessage) => ({
    statuses: [
      {
        id: 'wamid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjU1MzE4NTYxRjk5NzI1MkEyRgA=',
        status: 'sent',
        timestamp: Date.now(),
        recipient_id: data.receiver,
        conversation: {
          id: 'CONVERSATION_ID',
          expiration_timestamp: 'CONVERSATION_EXPIRATION_TIMESTAMP',
          origin: {
            type: 'user_initiated',
          },
        },
        pricing: {
          billable: true,
          pricing_model: 'CBP',
          category: 'user_initiated',
        },
      },
    ],
  }),
  button: (data: MockMetaMessage) => ({
    contacts: [
      {
        profile: {
          name: 'NAME',
        },
        wa_id: data.receiver,
      },
    ],
    messages: [
      {
        context: {
          from: data.receiver,
          id: 'wamid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjU1MzE4NTYxRjk5NzI1MkEyRgA=',
        },
        from: data.sender,
        id: 'wamid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjU1MzE4NTYxRjk5NzI1MkEyRgA=',
        timestamp: Date.now(),
        type: 'button',
        button: {
          text: 'Action',
          payload: 'button-payload',
        },
      },
    ],
  }),
};

export const mockMetaMessage = (data: MockMetaMessage): MetaMessageDTO => ({
  object: 'whatsapp_business_account',
  entry: [
    {
      id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
      changes: [
        {
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: data.receiver,
              phone_number_id: data.phoneNumberId ?? '123456378901234',
            },
            ...messageTypes[data.type](data),
          },
          field: 'messages',
        },
      ],
    },
  ],
});
