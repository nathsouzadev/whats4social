import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { ConfigService } from '@nestjs/config';
import { MetaService } from '../../../resources/client/meta.service';
import { GeminiService } from '../../../resources/client/gemini.service';

@Module({
  providers: [AudioService, ConfigService, MetaService, GeminiService],
})
export class AudioModule {}
