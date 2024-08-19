import { Module } from '@nestjs/common';
import { MessageService } from './service/message.service';
import { MessageController } from './message.controller';
import { SocialService } from '../social/services/social.service';
import { TwitterService } from '../../client/twitter.service';
import { BSkyService } from '../../client/bsky.service';
import { MetaService } from '../../client/meta.service';

@Module({
  controllers: [MessageController],
  providers: [
    MessageService,
    SocialService,
    TwitterService,
    BSkyService,
    MetaService
  ],
})
export class MessageModule {}
