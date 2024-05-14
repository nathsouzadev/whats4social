import { Module } from '@nestjs/common';
import { CronjobService } from './cronjob.service';

@Module({
  providers: [CronjobService]
})
export class CronjobModule {}
