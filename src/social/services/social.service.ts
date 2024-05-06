import { Injectable } from '@nestjs/common';
import { TwitterService } from '../client/twitter.service';
import { BSkyService } from '../client/bsky.service';
import { MetaService } from '../client/meta.service';

@Injectable()
export class SocialService {
  constructor(
    private readonly twitterService: TwitterService,
    private readonly bskyService: BSkyService,
    private readonly metaService: MetaService,
  ) {}

  private sendMessageToUser = async (data: {
    from: string;
    message: string;
    phoneNumberId: string;
  }) => this.metaService.sendMessage(data);

  webPost = async (
    message: string,
  ): Promise<{
    twitter: {
      data: {
        id: string;
        text: string;
      };
    };
    bsky: {
      uri: string;
      cid: string;
    };
  }> => {
    const [twitter, bsky] = await Promise.all([
      this.twitterService.post(message),
      this.bskyService.post(message),
    ]);

    return {
      twitter,
      bsky,
    };
  };

  whatsPost = async (data: {
    message: string;
    from: string;
    phoneNumberId: string;
  }): Promise<{
    twitter: {
      id: string;
    };
    bsky: {
      cid: string;
    };
  }> => {
    const { twitter, bsky } = await this.webPost(data.message);

    if (twitter.data.id) {
      this.sendMessageToUser({
        from: data.from,
        message: 'Twet posted successfully',
        phoneNumberId: data.phoneNumberId,
      });
    }

    if (bsky.cid) {
      this.sendMessageToUser({
        from: data.from,
        message: 'BSky posted successfully',
        phoneNumberId: data.phoneNumberId,
      });
    }

    return {
      twitter: {
        id: twitter.data.id,
      },
      bsky: {
        cid: bsky.cid,
      },
    };
  };

  reply = async (data: {
    message: string;
    from: string;
    phoneNumberId: string;
  }): Promise<void> => {
    await this.metaService.sendMessage({
      from: data.from,
      message: data.message.toLowerCase() === 'test' ? 'Reply your test. Not posted on social!' : 'Processing your posts',
      phoneNumberId: data.phoneNumberId,
    });

    if(data.message.toLowerCase() != 'test') this.whatsPost(data)
  };
}
