import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MetaService {
  constructor(private configService: ConfigService) {}

  sendMessage = async (data: {
    from: string;
    message: string;
    phoneNumberId: string;
  }): Promise<{ id: string }> => {
    try {
      const url = this.configService.get<string>('wb.url');
      const token = this.configService.get<string>('wb.graphApiToken');

      const response = await axios({
        method: 'POST',
        url: `${url}/${data.phoneNumberId}/messages`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
}
