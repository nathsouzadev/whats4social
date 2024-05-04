import { Test, TestingModule } from '@nestjs/testing';
import { MetaService } from './meta.service';
import { ConfigService } from '@nestjs/config';
import * as nock from 'nock';

describe('MetaService', () => {
  let service: MetaService;
  const mockUrl = 'https://graph.facebook.com/v18.0';
  const mockToken = 'token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetaService,
        {
          provide: ConfigService,
          useValue: {
            get: jest
              .fn()
              .mockReturnValueOnce(mockUrl)
              .mockReturnValueOnce(mockToken),
          },
        },
      ],
    }).compile();

    service = module.get<MetaService>(MetaService);
  });

  it('should send message', async () => {
    const mockPhoneNumberId = '5511444412345';
    nock(`${mockUrl}/${mockPhoneNumberId}/messages`)
      .post('')
      .reply(200, {
        messaging_product: 'whatsapp',
        contacts: [
          {
            input: '5511999991111',
            wa_id: '5511999991111',
          },
        ],
        messages: [
          {
            id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
          },
        ],
      });

    const response = await service.sendMessage({
      from: '5511999991111',
      message: 'Some message',
      phoneNumberId: mockPhoneNumberId,
    });
    expect(response).toMatchObject({
      id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
    });
  });
});
