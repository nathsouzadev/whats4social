import { Test, TestingModule } from '@nestjs/testing';
import { SocialService } from './social.service';
import { TwitterService } from '../client/twitter.service';
import { BSkyService } from '../client/bsky.service';
import { MetaService } from '../client/meta.service';

describe('SocialService', () => {
  let service: SocialService;
  let mockTwitterService: TwitterService;
  let mockBSkyService: BSkyService;
  let mockMetaService: MetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialService,
        {
          provide: TwitterService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: BSkyService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: MetaService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SocialService>(SocialService);
    mockTwitterService = module.get<TwitterService>(TwitterService);
    mockBSkyService = module.get<BSkyService>(BSkyService);
    mockMetaService = module.get<MetaService>(MetaService);
  });

  it('should create a new post via whatsapp', async () => {
    jest.spyOn(service, 'webPost').mockImplementation(() =>
      Promise.resolve({
        twitter: {
          data: {
            id: '1786581556854714590',
            text: 'New tuite',
          },
        },
        bsky: {
          uri: 'at://did:plc:fpnfkdvsz3pcjkfeyltowzuk/app.bsky.feed.post/3krmxwxnkzo27',
          cid: 'bafyreiebo6vnunvzir2tgf3rr732j34ecmnrsz75fssjkugqu6yeoprfoq',
        },
      }),
    );
    jest.spyOn(mockMetaService, 'sendMessage').mockImplementation(() =>
      Promise.resolve({
        id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
      }),
    );

    const mockMessage = 'New tuite';
    const mockFrom = '5511444412345';
    const mockPhoneNumberId = '5511432112345';
    const mockData = {
      message: mockMessage,
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
    };
    const response = await service.whatsPost(mockData);
    expect(service.webPost).toBeCalledWith(mockMessage);
    expect(mockMetaService.sendMessage).toHaveBeenCalledTimes(2);
    expect(response).toMatchObject({
      twitter: {
        id: '1786581556854714590',
      },
      bsky: {
        cid: 'bafyreiebo6vnunvzir2tgf3rr732j34ecmnrsz75fssjkugqu6yeoprfoq',
      },
    });
  });

  it('should complete bsky post if twitter post failed', async() => {
    jest.spyOn(service, 'webPost').mockImplementation(() =>
      Promise.resolve({
        twitter: {
          message: 'Failed to post!',
          error: 'Error creating a new post',
        },
        bsky: {
          uri: 'at://did:plc:fpnfkdvsz3pcjkfeyltowzuk/app.bsky.feed.post/3krmxwxnkzo27',
          cid: 'bafyreiebo6vnunvzir2tgf3rr732j34ecmnrsz75fssjkugqu6yeoprfoq',
        },
      }),
    );
    jest.spyOn(mockMetaService, 'sendMessage').mockImplementation(() =>
      Promise.resolve({
        id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
      }),
    );

    const mockMessage = 'New tuite';
    const mockFrom = '5511444412345';
    const mockPhoneNumberId = '5511432112345';
    const mockData = {
      message: mockMessage,
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
    };
    const response = await service.whatsPost(mockData);
    expect(service.webPost).toBeCalledWith(mockMessage);
    expect(mockMetaService.sendMessage).toHaveBeenCalledTimes(2);
    expect(response).toMatchObject({
      twitter: {
        message: 'Failed to post!',
      },
      bsky: {
        cid: 'bafyreiebo6vnunvzir2tgf3rr732j34ecmnrsz75fssjkugqu6yeoprfoq',
      },
    });
  })

  it('should reply to a message via whatsapp with process info', async () => {
    jest.spyOn(mockMetaService, 'sendMessage').mockImplementation(() =>
      Promise.resolve({
        id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
      }),
    );
    jest.spyOn(service, 'whatsPost').mockImplementation(() =>
      Promise.resolve({
        twitter: {
          id: '1786581556854714590',
        },
        bsky: {
          cid: 'bafyreiebo6vnunvzir2tgf3rr732j34ecmnrsz75fssjkugqu6yeoprfoq',
        },
      }),
    );

    const mockMessage = 'New tuite';
    const mockFrom = '5511444412345';
    const mockPhoneNumberId = '5511432112345';
    const mockData = {
      message: mockMessage,
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId
    };
    await service.reply(mockData);
    expect(mockMetaService.sendMessage).toHaveBeenCalledWith({
      message: 'Processing your posts',
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
    });
    expect(service.whatsPost).toHaveBeenCalledWith(mockData);
  });

  it('should not post a message with test', async () => {
    jest.spyOn(mockMetaService, 'sendMessage').mockImplementation(() =>
      Promise.resolve({
        id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
      }),
    );
    jest.spyOn(service, 'whatsPost')

    const mockMessage = 'Test';
    const mockFrom = '5511444412345';
    const mockPhoneNumberId = '5511432112345';
    const mockData = {
      message: mockMessage,
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId
    };
    await service.reply(mockData);
    expect(mockMetaService.sendMessage).toHaveBeenCalledWith({
      message: 'Reply your test. Not posted on social!',
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
    });
    expect(service.whatsPost).not.toHaveBeenCalled();
  });

  it('should create a new post via endpoint', async () => {
    jest.spyOn(mockTwitterService, 'post').mockImplementation(() =>
      Promise.resolve({
        data: {
          id: '1786581556854714590',
          text: 'New tuite',
        },
      }),
    );
    jest.spyOn(mockBSkyService, 'post').mockImplementation(() =>
      Promise.resolve({
        uri: 'at://did:plc:fpnfkdvsz3pcjkfeyltowzuk/app.bsky.feed.post/3krmxwxnkzo27',
        cid: 'bafyreiebo6vnunvzir2tgf3rr732j34ecmnrsz75fssjkugqu6yeoprfoq',
      }),
    );

    const response = await service.webPost('New tuite');
    expect(mockTwitterService.post).toBeCalledWith('New tuite');
    expect(mockBSkyService.post).toBeCalledWith('New tuite');
    expect(response).toMatchObject({
      twitter: {
        data: {
          id: '1786581556854714590',
          text: 'New tuite',
        },
      },
      bsky: {
        uri: 'at://did:plc:fpnfkdvsz3pcjkfeyltowzuk/app.bsky.feed.post/3krmxwxnkzo27',
        cid: 'bafyreiebo6vnunvzir2tgf3rr732j34ecmnrsz75fssjkugqu6yeoprfoq',
      },
    });
  });
});
