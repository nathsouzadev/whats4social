import { Test, TestingModule } from '@nestjs/testing';
import { BSkyService } from './bsky.service';
import { ConfigService } from '@nestjs/config';

const mockLogin = jest.fn();
const mockPost = jest.fn();
jest.mock('@atproto/api', () => ({
  BskyAgent: jest.fn().mockImplementation(() => ({
    login: mockLogin,
    post: mockPost,
  })),
}));

describe('BSkyService', () => {
  let service: BSkyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BSkyService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('some-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<BSkyService>(BSkyService);
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
});
