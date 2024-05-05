import { Test, TestingModule } from '@nestjs/testing';
import { BSkyService } from './bsky.service';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';

const mockLogin = jest.fn();
const mockPost = jest.fn();
const mockGetProfile = jest.fn();
jest.mock('@atproto/api', () => ({
  BskyAgent: jest.fn().mockImplementation(() => ({
    login: mockLogin,
    post: mockPost,
    getProfile: mockGetProfile,
  })),
}));

describe('BSkyService', () => {
  let service: BSkyService;
  let mockConfigService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BSkyService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValueOnce('service').
              mockReturnValueOnce('identifier').
              mockReturnValueOnce('password'),
          },
        },
      ],
    }).compile();

    service = module.get<BSkyService>(BSkyService);
    mockConfigService = module.get<ConfigService>(ConfigService);
  });

  it('should create a new post', async () => {
    mockPost.mockImplementation(() =>
      Promise.resolve({
        uri: 'at://did:plc:fpnfkdvsz3pcjkfeyltowzuk/app.bsky.feed.post/3krmxwxnkzo27',
        cid: 'bafyreiebo6vnunvzir2tgf3rr732j34ecmnrsz75fssjkugqu6yeoprfoq',
      }),
    );
    const response = await service.post('New post');
    expect(mockLogin).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith({
      text: 'New post',
      createdAt: expect.any(String),
    });
    expect(response).toMatchObject({
      uri: 'at://did:plc:fpnfkdvsz3pcjkfeyltowzuk/app.bsky.feed.post/3krmxwxnkzo27',
      cid: 'bafyreiebo6vnunvzir2tgf3rr732j34ecmnrsz75fssjkugqu6yeoprfoq',
    });
  });

  it('should throw an error when post creation fails', async () => {
    mockPost.mockImplementation(() => Promise.reject(new Error('Failed to create post')));
    await expect(service.post('New post'))
    .rejects.toThrow(new InternalServerErrorException('Failed to create post'));
  });

  it('should check health', async () => {
    mockGetProfile.mockImplementation(() => Promise.resolve({}));
    jest.spyOn(mockConfigService, 'get').mockReturnValueOnce('identifier');
    
    await service.health();
    expect(mockLogin).toHaveBeenCalled();
    expect(mockGetProfile).toHaveBeenCalledWith({ actor: 'identifier' });
  });
});
