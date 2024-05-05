import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as nock from 'nock';

jest.mock('twitter-api-client', () => ({
  TwitterClient: jest.fn().mockImplementation(() => ({
    accountsAndUsers: {
      accountSettings: jest.fn(),
    },
  })),
}));

jest.mock('@atproto/api', () => ({
  BskyAgent: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    countUnreadNotifications: jest.fn().mockImplementation(() => Promise.resolve({ data: { count: 0 } })),
  })),
}));

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('health check', async () => {
    const mockUrl = process.env.WB_URL;
    const mockPhoneNumberId = process.env.GRAPH_PHONE_NUMBER_ID;
    const token = process.env.GRAPH_API_TOKEN;
    nock(`${mockUrl}/${mockPhoneNumberId}`, {
      reqheaders: {
        authorization: `Bearer ${token}`,
      },
    })
      .get('?fields=health_status')
      .reply(200, {
        health_status: {
          can_send_message: 'BLOCKED',
          entities: [
            {
              entity_type: 'PHONE_NUMBER',
              id: '115135374948117',
              can_send_message: 'AVAILABLE',
            },
            {
              entity_type: 'WABA',
              id: '103966492746696',
              can_send_message: 'BLOCKED',
              errors: [[Object]],
            },
            {
              entity_type: 'BUSINESS',
              id: '274753541733951',
              can_send_message: 'LIMITED',
              errors: [[Object]],
            },
            {
              entity_type: 'APP',
              id: '728782632706155',
              can_send_message: 'AVAILABLE',
            },
          ],
        },
        id: '115135374948117',
      });

    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          status: 'ok',
          info: {
            twitterClient: { status: 'up' },
            bskyClient: { status: 'up' },
            metaClient: { status: 'up' },
          },
          error: {},
          details: {
            twitterClient: { status: 'up' },
            bskyClient: { status: 'up' },
            metaClient: { status: 'up' },
          },
        });
      });
  });
});
