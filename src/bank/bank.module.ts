import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { SocialService } from '../resources/clients/social/services/social.service';
import { BSkyService } from '../resources/clients/social/client/bsky.service';
import { MetaService } from '../resources/clients/social/client/meta.service';
import { TwitterService } from '../resources/clients/social/client/twitter.service';

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
