import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, tap, timestamp } from 'rxjs';
import { ResponseAPI } from '../model/response-api';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseAPI<T>> {
    return next.handle().pipe(
      map((responseData) => {
        return { success: true, timestamp: new Date(), ...responseData };
      }),
    );
  }
}
