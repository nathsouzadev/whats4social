import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MetaService } from '../../../resources/client/meta.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AudioService {
  private logger = new Logger(AudioService.name);
  private readonly token: string =
    this.configService.get<string>('wb.graphApiToken');

  constructor(
    private configService: ConfigService,
    private readonly metaService: MetaService,
  ) {}

  get = async (audioId: string) => {
    try {
      const { url } = await this.metaService.getAudioUrl(audioId);

      const audio = await axios({
        method: 'GET',
        url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      });

      this.logger.log(`Audio fetched ${JSON.stringify(audio.data)}`);

      return { url };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  };
}
