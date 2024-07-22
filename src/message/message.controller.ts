import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MessageService } from './service/message.service';
import { MetaMessageDTO } from './dto/meta-message.dto';

@Controller()
export class MessageController {
  private readonly logger = new Logger(MessageController.name);

  constructor(private readonly messageService: MessageService) {}

  @ApiOkResponse({
    description: 'Webhook receive whatsapp messages from Whatsapp API',
  })
  @Post()
  @HttpCode(200)
  async getHello(@Body() messageData: MetaMessageDTO) {
    const t0 = performance.now();
    this.logger.log(
      JSON.stringify({
        body: messageData,
      }),
    );

    await this.messageService.handleMessage(messageData.entry);

    this.logger.log(
      JSON.stringify({
        time: performance.now() - t0,
      }),
    );
    return { message: 'ok' };
  }

  @ApiOkResponse({
    description: 'Return challenge',
    schema: {
      example: {
        text: 'query.hub.challenge',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Return error when does not have token',
  })
  @Get()
  async register(@Request() req) {
    if (req.query['hub.verify_token'] == process.env.WEBHOOK_VERIFY_TOKEN) {
      return req.query['hub.challenge'];
    }
    throw new UnauthorizedException();
  }
}
