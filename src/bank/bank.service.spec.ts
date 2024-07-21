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
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BankService>(BankService);
  });

  it('should be reply from bank', async () => {
    const response = service.handle();
    expect(response).toBe('Hello from BankService');
  });
});
