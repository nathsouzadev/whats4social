import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { SocialService } from './services/social.service';

@Controller()
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @ApiCreatedResponse({
    description:
      'The post has been successfully created in all the social media platforms.',
    schema: {
      example: {
        twitter: {
          data: {
            id: '1786581556854714590',
            text: 'New tuite',
          },
        },
        bsky: {
          uri: 'at://did:plc:fpnfkdvsz3pcjkfeyltowzuk/app.bsky.feed.post/3krmxwxnkzo27',
          cid: 'bafyreiebo6vnunvzir2tgf3rr732j34ecmnrsz75fssjkugqu6yeoprfoq',
        },
      },
    },
  })
  @Post()
  @HttpCode(201)
  async post(@Body() createClientDto: CreatePostDto) {
    return this.socialService.webPost(createClientDto.message);
  }
}
