import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { TwitterService } from '../social/client/twitter.service';
import { BSkyService } from '../social/client/bsky.service';
import { MetaService } from '../social/client/meta.service';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [TwitterService, BSkyService, MetaService],
})
export class HealthModule {}
