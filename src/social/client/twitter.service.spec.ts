import { Test, TestingModule } from '@nestjs/testing';
import { TwitterService } from './twitter.service';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';

const mockCreateTweet = jest.fn();
const mockAccountSettings = jest.fn();
jest.mock('twitter-api-client', () => ({
  TwitterClient: jest.fn().mockImplementation(() => ({
    tweetsV2: {
      createTweet: mockCreateTweet,
    },
    accountsAndUsers: {
      accountSettings: mockAccountSettings,
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

  it('should throw an error when creating a new post', async () => {
    mockCreateTweet.mockImplementation(() =>
      Promise.reject(new Error('Error creating a new post')),
    );

    await expect(service.post('New tuite')).rejects.toThrow(new InternalServerErrorException('Error creating a new post'))
  });

  it('should return account settings', async () => {
    mockAccountSettings.mockImplementation(() =>
      Promise.resolve({
        data: {
          id: '123456789',
          username: 'username',
        },
      }),
    );
    const response = await service.health();
    expect(response).toMatchObject({
      data: {
        id: '123456789',
        username: 'username',
      },
    });
  })
});
