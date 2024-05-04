import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { mockTwitterResponse } from './__mocks__/twitter-response.mock';
import { mockBskyResponse } from './__mocks__/bsky-response.mock';

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

describe('SocialController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('create posts via endpoint', async () => {
    return request(app.getHttpServer())
      .post('/api/social')
      .expect(201)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          bsky: mockBskyResponse(),
          twitter: mockTwitterResponse(),
        });
      });
  });
});
