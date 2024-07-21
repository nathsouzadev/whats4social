import { Test, TestingModule } from '@nestjs/testing';
import { BankService } from './bank.service';

describe('BankService', () => {
  let service: BankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankService],
    }).compile();

    service = module.get<BankService>(BankService);
  });

  it('should be reply from bank', async () => {
    const response = service.handle();
    expect(response).toBe('Hello from BankService');
  })
});
