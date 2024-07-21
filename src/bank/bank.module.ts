import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { SocialService } from '../social/services/social.service';
import { BSkyService } from '../social/client/bsky.service';
import { MetaService } from '../social/client/meta.service';
import { TwitterService } from '../social/client/twitter.service';

@Module({
  providers: [
    BankService,
    SocialService,
    TwitterService,
    BSkyService,
    MetaService,
  ],
})
export class BankModule {}
