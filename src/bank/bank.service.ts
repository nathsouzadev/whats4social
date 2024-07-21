import { Injectable } from '@nestjs/common';

@Injectable()
export class BankService {
  handle = () => 'Hello from BankService';
}
