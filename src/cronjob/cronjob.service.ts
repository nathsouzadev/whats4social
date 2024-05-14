import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class CronjobService {
  private readonly logger = new Logger(CronjobService.name);
  private url: string

  constructor(private configService: ConfigService) {
    this.url = this.configService.get<string>('betterStack.url');
  }

  private check31days = (): boolean => {
    const monthsWithout31days = [1, 3, 5, 8, 10];
    const date = new Date();

    return !monthsWithout31days.includes(date.getMonth());
  }

  updateHealthCheck = async (paused: boolean, id: string) => {
    try {
      const response = await axios(
        {
          method: 'PATCH',
          url: `${this.url}/api/v2/monitors/${id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token',
          },
          data: {
            paused
          }
        })
      
      this.logger.log(`Health check updated ${JSON.stringify(response.data.data.attributes.pronounceable_name)}`);
      return response.data; 
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error.message)
    }
  };

  @Cron(CronExpression.EVERY_DAY_AT_1AM, { name: 'off-health-check' })
  async offHealthCheck() {
    if (this.check31days()) {
      const response = await Promise.allSettled([
        this.updateHealthCheck(true, this.configService.get<string>('betterStack.monitorId1')),
        this.updateHealthCheck(true, this.configService.get<string>('betterStack.monitorId2'))
      ])

      return { message: 'Health check updated', changes: response.map(result => ({
        id: result['value'].data.id,
        attributes: result['value'].data.attributes
      })) };
    }
    
    return { message: 'Health check not updated' }
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM, { name: 'on-health-check' })
  async onHealthCheck() {
    if (this.check31days()) {
      const response = await Promise.allSettled([
        this.updateHealthCheck(false, this.configService.get<string>('betterStack.monitorId1')),
        this.updateHealthCheck(false, this.configService.get<string>('betterStack.monitorId2'))
      ])

      return { message: 'Health check updated', changes: response.map(result => ({
        id: result['value'].data.id,
        attributes: result['value'].data.attributes
      })) };
    }
    
    return { message: 'Health check not updated' }
  }
}
