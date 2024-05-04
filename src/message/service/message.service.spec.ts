import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { SocialService } from '../../social/services/social.service';

describe('MessageService', () => {
  let service: MessageService;
  let mockSocialService: SocialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: SocialService,
          useValue: {
            reply: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    mockSocialService = module.get<SocialService>(SocialService);
  });

  it('should reply message', async () => {
    jest
      .spyOn(mockSocialService, 'reply')
      .mockImplementation(() => Promise.resolve(void 0));

    const mockMessage = 'New tuite';
    const mockFrom = '5511444412345';
    const mockPhoneNumberId = '5511432112345';
    const mockData = {
      message: mockMessage,
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
    };

    await service.reply(mockData);
    expect(mockSocialService.reply).toHaveBeenCalledWith(mockData);
  });
});
