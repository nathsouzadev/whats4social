import { Module } from '@nestjs/common';
import { SocialService } from './services/social.service';
import { SocialController } from './social.controller';
import { ConfigModule } from '@nestjs/config';
import { TwitterService } from './client/twitter.service';
import { BSkyService } from './client/bsky.service';
import { MetaService } from './client/meta.service';

@Module({
  imports: [ConfigModule],
  controllers: [SocialController],
  providers: [SocialService, TwitterService, BSkyService, MetaService],
})
export class SocialModule {}
