import { Module } from '@nestjs/common';
import { ClerkService } from './service/clerk.service';
import { ClerkController } from './clerk.controller';

@Module({
  controllers: [ClerkController],
  providers: [ClerkService],
})
export class ClerkModule {}
