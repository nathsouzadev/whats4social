import { Injectable } from '@nestjs/common';
import { SocialService } from '../social/services/social.service';

@Injectable()
export class BankService {

  constructor(
    private readonly socialService: SocialService,
  ) {}

  handle = () => 'Hello from BankService';
}
