import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterClient, CreateTweet } from 'twitter-api-client';

@Injectable()
export class TwitterService {
  private client: TwitterClient;

  constructor(private configService: ConfigService) {
    this.client = new TwitterClient({
      apiKey: this.configService.get<string>('twitter.apiKey'),
      apiSecret: this.configService.get<string>('twitter.apiSecret'),
      accessToken: this.configService.get<string>('twitter.accessToken'),
      accessTokenSecret: this.configService.get<string>(
        'twitter.accessTokenSecret',
      ),
    });
  }

  post = async (message: string): Promise<CreateTweet> =>
    await this.client.tweetsV2.createTweet({
      text: message,
    });
}
