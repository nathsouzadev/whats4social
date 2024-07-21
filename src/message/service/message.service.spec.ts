import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { SocialService } from '../../social/services/social.service';
import { mockMetaPayload } from '../../__mocks__/meta-message.mock';
import { ConfigService } from '@nestjs/config';

describe('MessageService', () => {
  let service: MessageService;
  let mockSocialService: SocialService;

  const mockPhoneNumber = '5521880881234'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: SocialService,
          useValue: {
            replyToWhatsapp: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest
              .fn()
              .mockReturnValue(mockPhoneNumber),
          },
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    mockSocialService = module.get<SocialService>(SocialService);
  });

  it('should reply message', async () => {
    jest
      .spyOn(mockSocialService, 'replyToWhatsapp')
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
    expect(mockSocialService.replyToWhatsapp).toHaveBeenCalledWith(mockData);
  });

  it('should reply message with valid true', async () => {
    const mockData = mockMetaPayload('message', mockPhoneNumber).entry

    jest
      .spyOn(mockSocialService, 'replyToWhatsapp')
      .mockImplementation(() => Promise.resolve(void 0));

    await service.handleMessage(mockData);
    expect(mockSocialService.replyToWhatsapp).toHaveBeenCalledWith({
      from: mockPhoneNumber,
      message: 'New post',
      phoneNumberId: '123456789012345'
    });
  });

  it('should not reply message with type different from text', async () => {
    const mockData = mockMetaPayload('status').entry

    jest
      .spyOn(mockSocialService, 'replyToWhatsapp')
      .mockImplementation(() => Promise.resolve(void 0));

    await service.handleMessage(mockData);
    expect(mockSocialService.replyToWhatsapp).not.toHaveBeenCalled();
  })
});
