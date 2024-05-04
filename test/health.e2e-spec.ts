import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

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
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          status: 'ok',
        });
      });
  });
});
