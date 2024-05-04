import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BskyAgent, ComAtprotoServerCreateSession } from '@atproto/api';

@Injectable()
export class BSkyService {
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
  ): Promise<{
    uri: string;
    cid: string;
  }> => {
    await this.login();
    return await this.agent.post({
      text: message,
      createdAt: new Date().toISOString(),
    });
  };

  health = async (): Promise<void> => {
    await this.login();
    await this.agent.getProfile({
      actor: this.configService.get('bsky.identifier'),
    });
  };
}
