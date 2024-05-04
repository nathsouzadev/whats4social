import {
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MessageService } from './service/message.service';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOkResponse({
    description: 'Webhook receive whatsapp messages from Whatsapp API',
  })
  @Post()
  @HttpCode(200)
  async getHello(@Request() req) {
    // check if the webhook request contains a message
    // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

    // check if the incoming message contains text
    if (message?.type === 'text') {
      // extract the business number to send the reply from it
      const business_phone_number_id =
        req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

      // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
      try {
        await this.messageService.reply({
          from: message.from,
          message: message.text.body,
          phoneNumberId: business_phone_number_id,
        });
      } catch (error) {
        console.log(error.message);
      }
    }

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
