import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MetaService {
  private readonly url: string = this.configService.get<string>('wb.url');
  private readonly token: string =
    this.configService.get<string>('wb.graphApiToken');
  private readonly phoneNumberId: string =
    this.configService.get<string>('wb.phoneNumberId');

  constructor(private configService: ConfigService) {}

  sendMessage = async (data: {
    from: string;
    message: string;
    phoneNumberId: string;
  }): Promise<{ id: string }> => {
    try {
      const response = await axios({
        method: 'POST',
        url: `${this.url}/${data.phoneNumberId}/messages`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        data: {
          messaging_product: 'whatsapp',
          to: data.from,
          text: { body: 'Reply ' + data.message },
        },
      });

      return response.data.messages[0];
    } catch (error) {
      console.log(error.message);
    }
  };

  health = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `${this.url}/${this.phoneNumberId}?fields=health_status`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      });

      response.data.health_status.entities.forEach((entity) => {
        if (
          (entity.entity_type === 'PHONE_NUMBER' &&
            entity.can_send_message === 'BLOCKED') ||
          (entity.entity_type === 'APP' &&
            entity.can_send_message === 'BLOCKED')
        ) {
          console.log(`Blocked ${entity.entity_type} ${entity.id}`);
          throw new Error(`Blocked ${entity.entity_type} ${entity.id}`);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
}
