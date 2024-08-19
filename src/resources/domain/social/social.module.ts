import { Module } from '@nestjs/common';
import { SocialService } from './social.service';

@Module({
  providers: [SocialService],
})
export class SocialModule {}
