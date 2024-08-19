import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { TwitterService } from '../resources/clients/social/client/twitter.service';
import { BSkyService } from '../resources/clients/social/client/bsky.service';
import { MetaService } from '../resources/clients/social/client/meta.service';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [TwitterService, BSkyService, MetaService],
})
export class HealthModule {}
