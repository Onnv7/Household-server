import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Hello } from '../../module/user-auth/payload/user-auth.response';

export class ResponseAPI<T = any> {
  @ApiProperty()
  message: string;
  @ApiProperty()
  data?: T;
}

export class AppError extends Error {
  constructor(errorData: ErrorData, devMessage?: string) {
    super(errorData.errorMessage);
    this.errorData = errorData;
    this.devMessage = devMessage;
  }

  errorData: ErrorData;
  devMessage: string;
}

export class ErrorData {
  errorCode: number;
  errorMessage: string;
  subErrorCode?: number;
  subErrorMessage?: string;
}

export class DevError {
  message: string;
}
export class ResponseError<T = any> {
  error: ErrorData;
  devError: DevError;
}
