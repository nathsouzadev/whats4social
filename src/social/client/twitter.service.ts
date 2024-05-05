import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TwitterClient,
  CreateTweet,
  AccountSettings,
} from 'twitter-api-client';

@Injectable()
export class TwitterService {
  private client: TwitterClient;
  private logger = new Logger(TwitterService.name);

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

  post = async (message: string): Promise<CreateTweet> => {
    try {
      const response = await this.client.tweetsV2.createTweet({
        text: message,
      });

      this.logger.log(`Tweet posted ${JSON.stringify(response)}`);
      return response
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message)
    }
  }

  health = async (): Promise<AccountSettings> =>
    this.client.accountsAndUsers.accountSettings();
}
