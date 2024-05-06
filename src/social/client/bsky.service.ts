import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BskyAgent, ComAtprotoServerCreateSession } from '@atproto/api';
import { BskyResponse } from '../model/bsky-response.model';
import { SocialError } from '../model/social-midia-response-error.model';

@Injectable()
export class BSkyService {
  private logger = new Logger(BSkyService.name);
  private agent: BskyAgent;

  constructor(private configService: ConfigService) {
    this.agent = new BskyAgent({
      service: this.configService.get<string>('bsky.service'),
    });
  }

  private login = async (): Promise<ComAtprotoServerCreateSession.Response> =>
    this.agent.login({
      identifier: this.configService.get('bsky.identifier'),
      password: this.configService.get('bsky.password'),
    });

  post = async (
    message: string,
  ): Promise<BskyResponse | SocialError> => {
    await this.login();
    try {
      const response = await this.agent.post({
        text: message,
        createdAt: new Date().toISOString(),
      });
      
      this.logger.log(`Post created ${JSON.stringify(response)}`);
      return response
    } catch (error) {
      this.logger.error(error.message);
      return {
        message: 'Failed to post!',
        error: error.message,
      }
    }
  };

  health = async (): Promise<{ count: number }> => {
    await this.login();
    const response = await this.agent.countUnreadNotifications();
    return response.data;
  };
}
