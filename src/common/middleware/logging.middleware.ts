import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import multer from 'multer';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
