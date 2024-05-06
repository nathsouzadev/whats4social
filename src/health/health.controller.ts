import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { TwitterService } from '../social/client/twitter.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { MetaService } from '../social/client/meta.service';

@Controller()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private readonly twitterService: TwitterService,
    private readonly bskyService: MetaService,
    private readonly metaService: MetaService,
    private readonly healtCheckService: HealthCheckService,
  ) {}

  @ApiOkResponse({ description: 'Service information' })
  @Get()
  @HealthCheck()
  async health() {
    return this.healtCheckService.check([
      () => this.checkStatus('twitterClient', this.twitterService.health()),
      () => this.checkStatus('bSkyClient', this.bskyService.health()),
      () => this.checkStatus('metaClient', this.metaService.health()),
    ]);
  }

  async checkStatus(
    service: string,
    fn: Promise<any>,
  ): Promise<HealthIndicatorResult> {
    try {
      await fn;
      return {
        [service]: { status: 'up' },
      };
    } catch (error) {
      this.logger.error(`${service} ${error.message}`);
      return {
        [service]: { status: 'down' },
      };
    }
  }
}
