import { Module } from '@nestjs/common';
import { MessageService } from './service/message.service';
import { MessageController } from './message.controller';
import { TwitterService } from '../../clients/social/client/twitter.service';
import { BSkyService } from '../../clients/social/client/bsky.service';
import { MetaService } from '../../clients/social/client/meta.service';
import { SocialService } from '../../clients/social/services/social.service';
import { BankService } from '../../../bank/bank.service';

@Module({
  controllers: [MessageController],
  providers: [
    MessageService,
    SocialService,
    TwitterService,
    BSkyService,
    MetaService,
    BankService
  ],
})
export class MessageModule {}
