import { Injectable } from '@nestjs/common';
import { TwitterService } from '../client/twitter.service';
import { BSkyService } from '../client/bsky.service';
import { MetaService } from '../client/meta.service';
import { CreateTweet } from 'twitter-api-client';
import { BskyResponse } from '../model/bsky-response.model';
import { SocialError } from '../model/social-midia-response-error.model';
import { WhatsPostResponseModel } from '../model/whats-post-response.model';
import { WhatsPostModel } from '../model/whats-post.model';
import { MessageModel } from '../model/whats-message.model';

@Injectable()
export class SocialService {
  constructor(
    private readonly twitterService: TwitterService,
    private readonly bskyService: BSkyService,
    private readonly metaService: MetaService,
  ) {}

  private sendMessageToUser = async (data: MessageModel) =>
    this.metaService.sendMessage(data);

  private message = async (data: WhatsPostModel) => {
    const messageContent =
      data.message.toLowerCase() === 'test'
        ? 'Reply your test. Not posted on social!'
        : 'Processing your posts';
    await this.metaService.sendMessage({
      from: data.from,
      message: messageContent,
      phoneNumberId: data.phoneNumberId,
      content: {
        text: {
          body: messageContent,
        },
      },
    });

    if (data.message.toLowerCase() != 'test') this.whatsPost(data);
  };

  private bank = async (data: WhatsPostModel) =>
    this.metaService.sendMessage({
      from: data.from,
      message: data.message,
      phoneNumberId: data.phoneNumberId,
      content: {
        text: {
          body: data.message,
        },
      },
    });

  webPost = async (
    message: string,
  ): Promise<{
    twitter: CreateTweet | SocialError;
    bsky: BskyResponse | SocialError;
  }> => {
    const [twitter, bsky] = await Promise.allSettled([
      this.twitterService.post(message),
      this.bskyService.post(message),
    ]);

    return {
      twitter:
        twitter.status === 'fulfilled'
          ? twitter.value
          : {
              message: 'Failed to post!',
              error: 'Error creating a new post',
            },
      bsky:
        bsky.status === 'fulfilled'
          ? bsky.value
          : {
              message: 'Failed to post!',
              error: 'Error creating a new post',
            },
    };
  };

  whatsPost = async (data: WhatsPostModel): Promise<WhatsPostResponseModel> => {
    const { twitter, bsky } = await this.webPost(data.message);
    const twitterMessage = Object.keys(twitter).includes('data')
      ? '✅ Twet posted successfully'
      : '❌ Failed to post on Twitter!';
    const bskyMessage = Object.keys(bsky).includes('cid')
      ? '✅ BSky posted successfully'
      : '❌ Failed to post on Bluesky!';

    this.sendMessageToUser({
      from: data.from,
      message: twitterMessage,
      phoneNumberId: data.phoneNumberId,
      content: {
        text: {
          body: twitterMessage,
        },
      },
    });

    this.sendMessageToUser({
      from: data.from,
      message: bskyMessage,
      phoneNumberId: data.phoneNumberId,
      content: {
        text: {
          body: bskyMessage,
        },
      },
    });

    return {
      twitter: Object.keys(twitter).includes('data')
        ? {
            id: twitter['data'].id,
          }
        : {
            message: 'Failed to post!',
          },
      bsky: Object.keys(bsky).includes('cid')
        ? {
            cid: bsky['cid'],
          }
        : { message: 'Failed to post!' },
    };
  };

  replyToWhatsapp = async (data: WhatsPostModel): Promise<void> => {
    await this[data.service](data);
  };
}
