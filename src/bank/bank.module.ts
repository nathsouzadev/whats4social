import { Module } from '@nestjs/common';
import { BankService } from './bank.service';

@Module({
  providers: [BankService],
})
export class BankModule {}
