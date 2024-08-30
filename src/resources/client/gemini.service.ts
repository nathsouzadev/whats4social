import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GeminiService {
  private logger = new Logger(GeminiService.name);

  sendAudio = (audio: Express.Multer.File) =>
    this.logger.log(`Audio received ${audio.buffer}`);
}
