import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MetaService } from '../../../resources/client/meta.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GeminiService } from '../../../resources/client/gemini.service';

@Injectable()
export class AudioService {
  private logger = new Logger(AudioService.name);
  private readonly token: string =
    this.configService.get<string>('wb.graphApiToken');

  constructor(
    private configService: ConfigService,
    private readonly metaService: MetaService,
    private readonly geminiService: GeminiService,
  ) {}

  get = async (audioId: string) => {
    try {
      const { url } = await this.metaService.getAudioUrl(audioId);

      const response = await axios({
        method: 'GET',
        url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      });

      this.geminiService.sendAudio(response.data);

      return { url };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  };
}
