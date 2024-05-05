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
                timestamp: '1714873932',
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