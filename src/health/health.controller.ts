import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { TwitterService } from '../social/client/twitter.service';
import { BSkyService } from '../social/client/bsky.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { MetaService } from '../social/client/meta.service';

@Controller()
export class HealthController {
  constructor(
    private readonly twitterService: TwitterService,
    private readonly bskyService: BSkyService,
    private readonly metaService: MetaService,
    private readonly healtCheckService: HealthCheckService,
  ) {}

  @ApiOkResponse({ description: 'Service information' })
  @Get()
  @HealthCheck()
  async health() {
    return this.healtCheckService.check([
      () => this.checkTwitter(),
      () => this.checkBSky(),
      () => this.checkMeta(),
    ]);
  }

  async checkBSky(): Promise<HealthIndicatorResult> {
    try {
      await this.bskyService.health();
      return {
        bskyClient: { status: 'up' },
      };
    } catch (error) {
      console.log(error);
      return {
        bskyClient: { status: 'down' },
      };
    }
  }

  async checkTwitter(): Promise<HealthIndicatorResult> {
    try {
      await this.twitterService.myUser();
      return {
        twitterClient: { status: 'up' },
      };
    } catch (error) {
      return {
        twitterClient: { status: 'down' },
      };
    }
  }

  async checkMeta(): Promise<HealthIndicatorResult> {
    try {
      await this.metaService.health();
      return {
        metaClient: { status: 'up' },
      };
    } catch (error) {
      return {
        metaClient: { status: 'down' },
      };
    }
  }
}
