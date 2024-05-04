import { ApiProperty } from '@nestjs/swagger';
import { MessageReceived, UpdateStatus } from '../models/meta-message.model';

export class MetaMessageDTO {
  @ApiProperty({
    example: 'whatsapp_business_account',
  })
  object: 'whatsapp_business_account';

  @ApiProperty({
    example: [
      {
        id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '5511988885555',
                phone_number_id: 'PHONE_NUMBER_ID',
              },
              contacts: [
                {
                  profile: {
                    name: 'NAME',
                  },
                  wa_id: '5511988885555',
                },
              ],
              messages: [
                {
                  from: '5511988885550',
                  id: 'wamid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjU1MzE4NTYxRjk5NzI1MkEyRgA=',
                  timestamp: 1687764143,
                  text: {
                    body: 'MESSAGE_BODY',
                  },
                  type: 'text',
                },
              ],
            },
            field: 'messages',
          },
        ],
      },
      {
        id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '5511988885555',
                phone_number_id: 'PHONE_NUMBER_ID',
              },
              statuses: [
                {
                  id: 'WHATSAPP_MESSAGE_ID',
                  status: 'sent',
                  timestamp: 'TIMESTAMP',
                  recipient_id: 'CUSTOMER_PHONE_NUMBER',
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
            },
            field: 'messages',
          },
        ],
      },
    ],
  })
  entry: WBRequest[];
}

interface WBRequest {
  id: string;
  changes: Array<{
    value: MessageReceived | UpdateStatus;
    field: 'messages';
  }>;
}
