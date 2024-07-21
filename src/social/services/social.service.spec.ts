import { Test, TestingModule } from '@nestjs/testing';
import { SocialService } from './social.service';
import { TwitterService } from '../client/twitter.service';
import { BSkyService } from '../client/bsky.service';
import { MetaService } from '../client/meta.service';
import { mock } from 'node:test';

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
      service: 'message',
    };
    const response = await service.whatsPost(mockData);
    expect(service.webPost).toBeCalledWith(mockMessage);
    expect(mockMetaService.sendMessage).toHaveBeenCalledWith({
      message: '✅ Twet posted successfully',
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      content: {
        text: {
          body: '✅ Twet posted successfully',
        },
      }
    });
    expect(mockMetaService.sendMessage).toHaveBeenCalledWith({
      message: '✅ BSky posted successfully',
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      content: {
        text: {
          body: '✅ BSky posted successfully',
        },
      }
    });
    expect(response).toMatchObject({
      twitter: {
        id: '1786581556854714590',
      },
      bsky: {
        cid: 'bafyreiebo6vnunvzir2tgf3rr732j34ecmnrsz75fssjkugqu6yeoprfoq',
      },
    });
  });

  it('should complete bsky post if twitter post fail', async () => {
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
      service: 'message',
    };
    const response = await service.whatsPost(mockData);
    expect(service.webPost).toBeCalledWith(mockMessage);
    expect(mockMetaService.sendMessage).toHaveBeenCalledWith({
      message: '❌ Failed to post on Twitter!',
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      content: {
        text: {
          body: '❌ Failed to post on Twitter!',
        },
      }
    });
    expect(mockMetaService.sendMessage).toHaveBeenCalledWith({
      message: '✅ BSky posted successfully',
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      content: {
        text: {
          body: '✅ BSky posted successfully',
        },
      }
    });
    expect(response).toMatchObject({
      twitter: {
        message: 'Failed to post!',
      },
      bsky: {
        cid: 'bafyreiebo6vnunvzir2tgf3rr732j34ecmnrsz75fssjkugqu6yeoprfoq',
      },
    });
  });

  it('should complete twitter post if bsky post fail', async () => {
    jest.spyOn(service, 'webPost').mockImplementation(() =>
      Promise.resolve({
        twitter: {
          data: {
            id: '1786581556854714590',
            text: 'New tuite',
          },
        },
        bsky: {
          message: 'Failed to post!',
          error: 'Error creating a new post',
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
      service: 'message',
    };
    const response = await service.whatsPost(mockData);
    expect(service.webPost).toBeCalledWith(mockMessage);
    expect(mockMetaService.sendMessage).toHaveBeenCalledWith({
      message: '✅ Twet posted successfully',
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      content: {
        text: {
          body: '✅ Twet posted successfully',
        },
      }
    });
    expect(mockMetaService.sendMessage).toHaveBeenCalledWith({
      message: '❌ Failed to post on Bluesky!',
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      content: {
        text: {
          body: '❌ Failed to post on Bluesky!',
        },
      }
    });
    expect(response).toMatchObject({
      twitter: {
        id: '1786581556854714590',
      },
      bsky: {
        message: 'Failed to post!',
      },
    });
  });

  it('should reply to a message via whatsapp with bank text message', async () => {
    jest.spyOn(mockMetaService, 'sendMessage').mockImplementation(() =>
      Promise.resolve({
        id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
      }),
    );

    const mockMessage = 'Bem vinda ao Social Bank!';
    const mockFrom = '5511444412345';
    const mockPhoneNumberId = '5511432112345';
    const mockData = {
      message: mockMessage,
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      service: 'bank',
    };
    await service.replyToWhatsapp(mockData);
    expect(mockMetaService.sendMessage).toHaveBeenCalledWith({
      message: mockMessage,
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      content: {
        text: {
          body: mockMessage,
        },
      }
    });
  });

  it('should reply to a message via whatsapp with bank button message', async () => {
    jest.spyOn(mockMetaService, 'sendMessage').mockImplementation(() =>
      Promise.resolve({
        id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
      }),
    );

    const mockMessage = '🤗 Bem vinda ao Social Bank!';
    const mockFrom = '5511444412345';
    const mockPhoneNumberId = '5511432112345';
    const mockContent = {
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: '🤗 Bem vinda ao Social Bank!',
        },
        footer: {
          text: 'Social Bank é apenas uma demo de um sistema bancário disponível no WhatsApp. Desenvolvido por @nathsouzadev',
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                title: 'Ver saldo',
                id: 'balance',
              },
            },
            {
              type: 'reply',
              reply: {
                title: 'Ver extrato',
                id: 'extract',
              },
            }
          ]
        }
      }
    }

    const mockData = {
      message: mockMessage,
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      service: 'bank',
      content: mockContent,
    };
    await service.replyToWhatsapp(mockData);
    expect(mockMetaService.sendMessage).toHaveBeenCalledWith({
      message: mockMessage,
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      content: mockContent
    });
  });

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
      phoneNumberId: mockPhoneNumberId,
      service: 'message',
    };
    await service.replyToWhatsapp(mockData);
    expect(mockMetaService.sendMessage).toHaveBeenCalledWith({
      message: 'Processing your posts',
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      content: {
        text: {
          body: 'Processing your posts',
        },
      }
    });
    expect(service.whatsPost).toHaveBeenCalledWith(mockData);
  });

  it('should not post a message with test', async () => {
    jest.spyOn(mockMetaService, 'sendMessage').mockImplementation(() =>
      Promise.resolve({
        id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
      }),
    );
    jest.spyOn(service, 'whatsPost');

    const mockMessage = 'Test';
    const mockFrom = '5511444412345';
    const mockPhoneNumberId = '5511432112345';
    const mockData = {
      message: mockMessage,
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      service: 'message',
    };
    await service.replyToWhatsapp(mockData);
    expect(mockMetaService.sendMessage).toHaveBeenCalledWith({
      message: 'Reply your test. Not posted on social!',
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      content: {
        text: {
          body: 'Reply your test. Not posted on social!',
        },
      }
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

  it('should create a twitter post, if bsky faild', async () => {
    jest.spyOn(mockTwitterService, 'post').mockImplementation(() =>
      Promise.resolve({
        data: {
          id: '1786581556854714590',
          text: 'New tuite',
        },
      }),
    );
    jest
      .spyOn(mockBSkyService, 'post')
      .mockImplementation(() =>
        Promise.reject(new Error('Failed to create post')),
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
        message: 'Failed to post!',
        error: 'Error creating a new post',
      },
    });
  });

  it('should create a bsky post, if twitter faild', async () => {
    jest
      .spyOn(mockTwitterService, 'post')
      .mockImplementation(() =>
        Promise.reject(new Error('Failed to create post')),
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
        message: 'Failed to post!',
        error: 'Error creating a new post',
      },
      bsky: {
        uri: 'at://did:plc:fpnfkdvsz3pcjkfeyltowzuk/app.bsky.feed.post/3krmxwxnkzo27',
        cid: 'bafyreiebo6vnunvzir2tgf3rr732j34ecmnrsz75fssjkugqu6yeoprfoq',
      },
    });
  });
});
