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

  whatsPost = async (data: {
    message: string;
    from: string;
    phoneNumberId: string;
  }): Promise<{
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
      this.twitterService.post(data.message),
      this.bskyService.post(data.message),
    ]);

    if (twitter.data.id) {
      this.metaService.sendMessage({
        from: data.from,
        message: 'Twet posted successfully',
        phoneNumberId: data.phoneNumberId,
      });
    }

    if (bsky.cid) {
      this.metaService.sendMessage({
        from: data.from,
        message: 'BSky posted successfully',
        phoneNumberId: data.phoneNumberId,
      });
    }

    return {
      twitter,
      bsky,
    };
  };

  reply = async (data: {
    message: string;
    from: string;
    phoneNumberId: string;
  }): Promise<void> => {
    await this.metaService.sendMessage({
      from: data.from,
      message: 'Processing your posts',
      phoneNumberId: data.phoneNumberId,
    });

    this.whatsPost(data);
  };

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
}
