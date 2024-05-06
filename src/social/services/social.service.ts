import { Injectable } from '@nestjs/common';
import { TwitterService } from '../client/twitter.service';
import { BSkyService } from '../client/bsky.service';
import { MetaService } from '../client/meta.service';
import { CreateTweet } from 'twitter-api-client';
import { BskyResponse } from '../model/bsky-response.model';
import { SocialError } from '../model/social-midia-response-error.model';
import { WhatsPostResponseModel } from '../model/whats-post-response.model';
import { WhatsPostModel } from '../model/whats-post.model';

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
    twitter: CreateTweet | SocialError;
    bsky: BskyResponse | SocialError;
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

  whatsPost = async (data: WhatsPostModel): Promise<WhatsPostResponseModel> => {
    const { twitter, bsky } = await this.webPost(data.message);

    this.sendMessageToUser({
      from: data.from,
      message: Object.keys(twitter).includes('data') ? 
        '✅ Twet posted successfully' : 
        '❌ Failed to post on Twitter!',
      phoneNumberId: data.phoneNumberId,
    });

    this.sendMessageToUser({
      from: data.from,
      message: Object.keys(bsky).includes('cid') ? 
        '✅ BSky posted successfully' : 
        '❌ Failed to post on Bluesky!',
      phoneNumberId: data.phoneNumberId,
    });

    return {
      twitter: Object.keys(twitter).includes('data') ? {
        id: twitter['data'].id,
      } : {
        message: 'Failed to post!',
      },
      bsky: Object.keys(bsky).includes('cid') ? {
        cid: bsky['cid'],
      } : { message: 'Failed to post!' },
    };
  };

  replyToWhatsapp = async (data: WhatsPostModel): Promise<void> => {
    await this.metaService.sendMessage({
      from: data.from,
      message: data.message.toLowerCase() === 'test' ? 'Reply your test. Not posted on social!' : 'Processing your posts',
      phoneNumberId: data.phoneNumberId,
    });

    if(data.message.toLowerCase() != 'test') this.whatsPost(data)
  };
}
