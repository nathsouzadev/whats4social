import { Module } from '@nestjs/common';
import { SocialService } from './services/social.service';
import { BSkyService } from '../../client/bsky.service';
import { MetaService } from '../../client/meta.service';
import { TwitterService } from '../../client/twitter.service';
import { SocialController } from './social.controller';

@Module({
  controllers: [SocialController],
  providers: [SocialService, TwitterService, BSkyService, MetaService],
})
export class SocialModule {}
