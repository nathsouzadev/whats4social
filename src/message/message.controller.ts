import {
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

@Controller()
export class MessageController {
  private readonly logger = new Logger(MessageController.name);
  
  constructor(private readonly messageService: MessageService) {}

  @ApiOkResponse({
    description: 'Webhook receive whatsapp messages from Whatsapp API',
  })
  @Post()
  @HttpCode(200)
  async getHello(@Request() req) {
    const t0 = performance.now();
    
    await this.messageService.handleMessage(req.body);

    this.logger.log(JSON.stringify({
      body: req.body,
      time: performance.now() - t0,
    }))
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
