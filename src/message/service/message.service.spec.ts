import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { SocialService } from '../../social/services/social.service';
import { MetaPayload } from '../models/meta-message.model';

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
      valid: true,
    };

    await service.reply(mockData);
    expect(mockSocialService.reply).toHaveBeenCalledWith(mockData);
  });

  it('should reply message with valid true', async () => {
    const mockData = {
      entry: [
        {
          changes: [
            {
              value: {
                messages: [
                  {
                    type: 'text',
                    from: '5511444412345',
                    text: {
                      body: 'New tuite',
                    },
                  },
                ],
                metadata: {
                  phone_number_id: '5511432112345',
                },
              },
            },
          ],
        },
      ],
    };

    jest
      .spyOn(mockSocialService, 'reply')
      .mockImplementation(() => Promise.resolve(void 0));

    await service.handleMessage(mockData as MetaPayload);
    expect(mockSocialService.reply).toHaveBeenCalledWith({
      from: '5511444412345',
      message: 'New tuite',
      phoneNumberId: '5511432112345',
      valid: true,
    });
  });
});
