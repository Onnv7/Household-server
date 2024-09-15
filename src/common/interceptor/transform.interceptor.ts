import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, map, tap, timestamp } from 'rxjs';
import { ResponseAPI } from '../model/response-api';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  private readonly logger = new Logger(TransformInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseAPI<T>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((responseData) => {
        return { success: true, timestamp: new Date(), ...responseData };
      }),
    );
  }
}
