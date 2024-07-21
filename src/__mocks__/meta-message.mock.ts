import { MetaPayload } from '../message/models/meta-message.model'

export const mockEntry = [
    {
      id: '103969782746696',
      changes: [
        {
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: '5511912344321',
              phone_number_id: '123456789012345',
            },
            contacts: [
              {
                profile: {
                  name: 'Ada Lovelace',
                },
                wa_id: '5511999991234',
              },
            ],
            messages: [
              {
                from: '5511999991234',
                id: 'wamid.HBgNNTUxMTk5MDExNjU1NRUCABIYFsWEQjA2QzEzMzM4QzhEMTFFRDgyNjkA',
                timestamp: 1714873932,
                text: {
                  body: 'Some post',
                },
                type: 'text',
              },
            ],
          },
          field: 'messages',
        },
      ],
    },
  ]

export const mockMetaMessage = {
    object: 'whatsapp_business_account',
    entry: mockEntry
}

const messageTypes = {
  message: (phoneNumber: string) => ({
    contacts: [
      {
        profile: {
          name: 'Ada Lovelace',
        },
        wa_id: phoneNumber,
      },
    ],
    messages: [
      {
        from: phoneNumber,
        id: 'wamid.HBgNNTUxMTk5MDExNjU1NRUCABIYFsWEQjA2QzEzMzM4QzhEMTFFRDgyNjkA',
        timestamp: 1714873932,
        text: {
          body: 'New post',
        },
        type: 'text',
      },
    ],
  }),
  status: () => ({
    statuses: [
      {
        id: 'wamid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjU1MzE4NTYxRjk5NzI1MkEyRgA=',
        status: 'sent',
        timestamp: Date.now(),
        recipient_id: '5511999991234',
        conversation: {
          id: 'cae087203c7ac27b847335769856f491',
          expiration_timestamp: 1714873932,
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
}

export const mockMetaPayload = (type: string, phoneNumber = '5511999991234'): MetaPayload => ({
  object: 'whatsapp_business_account',
  entry: [
    {
      id: '103969782746696',
      changes: [
        {
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: '5511912344321',
              phone_number_id: '123456789012345',
            },
            ...messageTypes[type](phoneNumber),
          },
          field: 'messages',
        },
      ],
    },
  ]
})
