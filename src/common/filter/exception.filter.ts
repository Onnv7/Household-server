import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomError } from '../model/response-api';
import { ErrorCode, HttpCodeMessage } from '../../constant/response.constant';

@Catch(CustomError)
export class CustomExceptionHandlerFilter implements ExceptionFilter {
  catch(exception: CustomError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(HttpCodeMessage[exception.errorData.errorCode]).json({
      timestamp: new Date().toISOString(),
      error: exception.errorData,
      devError: {
        message: exception.devMessage,
      },
    });
  }
}

@Catch(Error)
export class ExceptionHandlerFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message;

    response.status(500).json({
      timestamp: new Date().toISOString(),
      error: { errorCode: ErrorCode.SERVER_ERROR, errorMessage: message },
      devError: {
        message:
          exception instanceof BadRequestException
            ? exception.getResponse()
            : exception.message,
      },
    });
  }
}
