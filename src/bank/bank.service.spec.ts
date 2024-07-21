import { Test, TestingModule } from '@nestjs/testing';
import { BankService } from './bank.service';
import { SocialService } from '../social/services/social.service';

describe('BankService', () => {
  let service: BankService;
  let mockSocialService: SocialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankService,
        {
          provide: SocialService,
          useValue: {
            replyToWhatsapp: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BankService>(BankService);
    mockSocialService = module.get<SocialService>(SocialService);
  });

  it('should be reply from bank', async () => {
    jest
      .spyOn(mockSocialService, 'replyToWhatsapp')
      .mockImplementation(() => Promise.resolve(void 0));

    const mockFrom = '5511444412345';
    const mockPhoneNumberId = '5511432112345';
    const mockData = {
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
    };

    await service.handle(mockData);
    expect(mockSocialService.replyToWhatsapp).toHaveBeenCalledWith({
      ...mockData,
      message: '🤗 Bem vinda ao Social Bank!',
      service: 'bank',
      content: {
        type: 'interactive',
        recipient_type: 'individual',
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
              },
            ],
          },
        },
      },
    });
  });
});
