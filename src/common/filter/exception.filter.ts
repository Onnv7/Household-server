import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppError } from '../model/response-api';
import { ErrorCode, HttpCodeMessage } from '../../constant/response.constant';

const logger = new Logger('ExceptionHandler');
@Catch(AppError)
export class CustomExceptionHandlerFilter implements ExceptionFilter {
  catch(exception: AppError, host: ArgumentsHost) {
    console.log('🚀 ~ CustomExceptionHandlerFilter ~ exception:', exception);
    logger.log(exception.stack);
    logger.log(exception.message);

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
    console.log('🚀 ~ ExceptionHandlerFilter ~ exception:', exception);
    logger.log(exception.stack);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message;

    response.status(500).json({
      timestamp: new Date().toISOString(),
      error: { errorCode: ErrorCode.SERVER_ERROR, errorMessage: message },
      devError: {
        message: exception instanceof BadRequestException ? exception.getResponse() : exception.message,
      },
    });
  }
}
