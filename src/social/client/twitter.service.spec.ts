import { Test, TestingModule } from '@nestjs/testing';
import { TwitterService } from './twitter.service';
import { ConfigService } from '@nestjs/config';

const mockCreateTweet = jest.fn();
jest.mock('twitter-api-client', () => ({
  TwitterClient: jest.fn().mockImplementation(() => ({
    tweetsV2: {
      createTweet: mockCreateTweet,
    },
  })),
}));

describe('TwitterService', () => {
  let service: TwitterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TwitterService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('some-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<TwitterService>(TwitterService);
  });

  it('should create a new post', async () => {
    mockCreateTweet.mockImplementation(() =>
      Promise.resolve({
        data: {
          id: '1786581556854714590',
          text: 'New tuite',
        },
      }),
    );
    const result = await service.post('New tuite');
    expect(mockCreateTweet).toHaveBeenCalledWith({
      text: 'New tuite',
    });
    expect(result).toMatchObject({
      data: {
        id: '1786581556854714590',
        text: 'New tuite',
      },
    });
  });
});
