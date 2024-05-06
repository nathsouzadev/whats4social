import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger(LoggerMiddleware.name);
  
    use(req: Request, _res: Response, next: NextFunction) {
    this.logger.log(JSON.stringify({
        date: new Date().toISOString(),
        id: randomUUID(),
        headers: req.headers,
        origin: req.originalUrl
    }))
    next();
  }
}
