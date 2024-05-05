import { Test, TestingModule } from '@nestjs/testing';
import { MetaService } from './meta.service';
import { ConfigService } from '@nestjs/config';
import * as nock from 'nock';
import { InternalServerErrorException } from '@nestjs/common';

describe('MetaService', () => {
  let service: MetaService;

  const mockUrl = 'https://graph.facebook.com/v18.0';
  const mockToken = 'token';
  const mockPhoneNumberId = '123456789012345';

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
              .mockReturnValueOnce(mockToken)
              .mockReturnValueOnce(mockPhoneNumberId),
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

  it('should throw an error when message sending fails', async () => {
    nock(`${mockUrl}/${mockPhoneNumberId}/messages`)
      .post('')
      .replyWithError({
        statusCode: 500,
        error: 'Internal Server Error',
      });

    await expect(
      service.sendMessage({
        from: '5511999991111',
        message: 'Some message',
        phoneNumberId: mockPhoneNumberId,
      }),
    ).rejects.toThrow(new InternalServerErrorException('Internal Server Error'));
  });

  it('should check health', async () => {
    nock(`${mockUrl}/${mockPhoneNumberId}`)
      .get('?fields=health_status')
      .reply(200, {
        health_status: {
          entities: [
            {
              entity_type: 'PHONE_NUMBER',
              can_send_message: 'OK',
              id: mockPhoneNumberId,
            },
          ],
        },
      });

    const response = await service.health();
    expect(response).toMatchObject({ status: 'OK' });
  });

  it('should throw an error when health check fails because entity status', async () => {
    for (const entity of ['PHONE_NUMBER', 'APP']) {
      nock(`${mockUrl}/${mockPhoneNumberId}`)
        .get('?fields=health_status')
        .reply(200, {
          health_status: {
            entities: [
              {
                entity_type: entity,
                can_send_message: 'BLOCKED',
                id: mockPhoneNumberId,
              },
            ],
          },
        });

      await expect(service.health()).rejects.toThrow(
        new InternalServerErrorException(`Blocked ${entity} ${mockPhoneNumberId}`),
      );
    }
  });
});
