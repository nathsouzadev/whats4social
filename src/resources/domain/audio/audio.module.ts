import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { ConfigService } from '@nestjs/config';
import { MetaService } from '../../../resources/client/meta.service';

@Module({
  providers: [AudioService, ConfigService, MetaService],
})
export class AudioModule {}
