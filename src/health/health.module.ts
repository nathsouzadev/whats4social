import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { BSkyService } from '../resources/client/bsky.service';
import { MetaService } from '../resources/client/meta.service';
import { TwitterService } from '../resources/client/twitter.service';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [TwitterService, BSkyService, MetaService],
})
export class HealthModule {}
