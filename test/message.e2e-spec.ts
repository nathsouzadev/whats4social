import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { randomUUID } from 'crypto';
import * as nock from 'nock';
import { mockMetaMessage } from './__mocks__/meta-received-data.mock';
import { mockBskyResponse } from './__mocks__/bsky-response.mock';
import { mockTwitterResponse } from './__mocks__/twitter-response.mock';

jest.mock('twitter-api-client', () => ({
  TwitterClient: jest.fn().mockImplementation(() => ({
    tweetsV2: {
      createTweet: jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockTwitterResponse())),
    },
  })),
}));

jest.mock('@atproto/api', () => ({
  BskyAgent: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    post: jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockBskyResponse())),
  })),
}));

describe('MessageController (e2e)', () => {
  let app: INestApplication;

  const mockUrl = 'https://graph.facebook.com/v18.0';
  process.env.WB_URL = mockUrl;
  const mockPhoneNumberId = '1234567890';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('receive message from meta', () => {
    describe('answer message to user', () => {
      it('return 200 when receive a message', () => {
        const mockCompanyPhone = '551199991234';
        const mockCustomerPhone = '5511999991111';
        nock(`${mockUrl}/${mockPhoneNumberId}/messages`)
          .post('')
          .times(3)
          .reply(200, {
            messaging_product: 'whatsapp',
            contacts: [
              {
                input: mockCustomerPhone,
                wa_id: mockCustomerPhone,
              },
            ],
            messages: [
              {
                id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
              },
            ],
          });

        return request(app.getHttpServer())
          .post('/message')
          .send(
            mockMetaMessage({
              message: 'Some message',
              receiver: mockCompanyPhone,
              sender: mockCustomerPhone,
              phoneNumberId: mockPhoneNumberId,
              type: 'message',
            }),
          )
          .expect(200);
      });
    });
    describe('activate webhook with Meta', () => {
      const mockToken = randomUUID();
      process.env.WEBHOOK_VERIFY_TOKEN = mockToken;
      const mockChallenge = '1158201444';

      const handleResponse = async (response: any) => {
        expect(response.text).toBe(mockChallenge);
      };

      it('should return 200 with challenge', async () => {
        return request(app.getHttpServer())
          .get(
            `/message?hub.mode=subscribe&hub.challenge=${mockChallenge}&hub.verify_token=${mockToken}`,
          )
          .expect(200)
          .then(handleResponse);
      });

      it('should return 401 when have invalid token', () => {
        return request(app.getHttpServer())
          .get(
            `/message?hub.mode=subscribe&hub.challenge=${mockChallenge}&hub.verify_token=${randomUUID()}`,
          )
          .expect(401);
      });
    });
  });
});
