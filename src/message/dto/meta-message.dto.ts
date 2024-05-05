import { ApiProperty } from '@nestjs/swagger';
import { WBPayloadEntry } from '../models/meta-message.model';
import { mockEntry } from '../../__mocks__/meta-message.mock';

export class MetaMessageDTO {
  @ApiProperty({
    example: 'whatsapp_business_account',
  })
  object: 'whatsapp_business_account';

  @ApiProperty({
    example: mockEntry,
  })
  entry: WBPayloadEntry[];
}

