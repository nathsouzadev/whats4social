import { Test, TestingModule } from '@nestjs/testing';
import { BankService } from './bank.service';
import { SocialService } from '../social/services/social.service';
import { CONTENT_BODY } from './constants/content';

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
      contentReply: {
        body: '/bank',
      },
    };

    await service.handle(mockData);
    expect(mockSocialService.replyToWhatsapp).toHaveBeenCalledWith({
      ...mockData,
      message: '🤗 Bem vinda ao Social Bank!',
      service: 'bank',
      content: CONTENT_BODY.WELLCOME,
    });
  });

  it('should be reply with balance account', async () => {
    jest
      .spyOn(mockSocialService, 'replyToWhatsapp')
      .mockImplementation(() => Promise.resolve(void 0));

    const mockFrom = '5511444412345';
    const mockPhoneNumberId = '5511432112345';
    const mockData = {
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      contentReply: {
        type: 'button_reply',
        button_reply: {
          id: 'balance',
          title: 'Ver saldo',
        },
      },
    };

    await service.handle(mockData);
    expect(mockSocialService.replyToWhatsapp).toHaveBeenCalledWith({
      ...mockData,
      message: 'Seu saldo é de R$ 1000,00',
      service: 'bank',
      content: CONTENT_BODY.BALANCE,
    });
  });

  it('should be reply with purchase options', async () => {
    jest
      .spyOn(mockSocialService, 'replyToWhatsapp')
      .mockImplementation(() => Promise.resolve(void 0));

    const mockFrom = '5511444412345';
    const mockPhoneNumberId = '5511432112345';
    const mockData = {
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      contentReply: {
        type: 'button_reply',
        button_reply: {
          id: 'purchase',
          title: 'Fazer uma compra',
        },
      },
    };

    await service.handle(mockData);
    expect(mockSocialService.replyToWhatsapp).toHaveBeenCalledWith({
      ...mockData,
      message: 'Escolha um item que deseja comprar',
      service: 'bank',
      content: CONTENT_BODY.PURCHASE,
    });
  });

  it('should be reply with completed options', async () => {
    jest
      .spyOn(mockSocialService, 'replyToWhatsapp')
      .mockImplementation(() => Promise.resolve(void 0));

    const mockFrom = '5511444412345';
    const mockPhoneNumberId = '5511432112345';
    const mockData = {
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      contentReply: {
        type: 'button_reply',
        button_reply: {
          id: 'completed',
          title: '🖥️ Monitor R$ 500.00',
        },
      },
    };

    await service.handle(mockData);
    expect(mockSocialService.replyToWhatsapp).toHaveBeenCalledWith({
      ...mockData,
      message: 'Compra realizada com sucesso',
      service: 'bank',
      content: CONTENT_BODY.PURCHASE_COMPLETED,
    });
  });

  it('should be reply with refused options', async () => {
    jest
      .spyOn(mockSocialService, 'replyToWhatsapp')
      .mockImplementation(() => Promise.resolve(void 0));

    const mockFrom = '5511444412345';
    const mockPhoneNumberId = '5511432112345';
    const mockData = {
      from: mockFrom,
      phoneNumberId: mockPhoneNumberId,
      contentReply: {
        type: 'button_reply',
        button_reply: {
          id: 'refused',
          title: '💻 PC R$ 2000.00',
        },
      },
    };

    await service.handle(mockData);
    expect(mockSocialService.replyToWhatsapp).toHaveBeenCalledWith({
      ...mockData,
      message: 'Compra recusada',
      service: 'bank',
      content: CONTENT_BODY.PURCHASE_REFUSED,
    });
  });
});
