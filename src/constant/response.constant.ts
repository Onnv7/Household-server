import { ErrorData } from '../common/model/response-api';

export const ResponseMessage = {
  GET: 'Get successfully',
  UPDATE: 'Update successfully',
  DELETE: 'Delete successfully',
  CREATE: 'Create successfully',
};

export enum ErrorCode {
  NOT_FOUND = 14,
  SERVER_ERROR = 15,
  UNAUTHORIZED = 16,
}

export const ErrorMessage = {
  [ErrorCode.NOT_FOUND]: 'Not found',
  [ErrorCode.SERVER_ERROR]: 'Server error',
  [ErrorCode.UNAUTHORIZED]: 'Unauthorized',
};

export const HttpCodeMessage = {
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.SERVER_ERROR]: 500,
  [ErrorCode.UNAUTHORIZED]: 401,
};

export const ErrorResponseData = {
  SERVER_ERROR: {
    errorCode: ErrorCode.SERVER_ERROR,
    errorMessage: ErrorMessage[ErrorCode.SERVER_ERROR],
  },

  NOT_FOUND: {
    errorCode: ErrorCode.NOT_FOUND,
    errorMessage: ErrorMessage[ErrorCode.NOT_FOUND],
  },
  UNAUTHORIZED: {
    errorCode: ErrorCode.UNAUTHORIZED,
    errorMessage: ErrorMessage[ErrorCode.UNAUTHORIZED],
  },

  USER_NOT_FOUND: {
    errorCode: ErrorCode.NOT_FOUND,
    errorMessage: ErrorMessage[ErrorCode.NOT_FOUND],
    subErrorCode: 1401,
    subErrorMessage: 'User not found',
  } as ErrorData,

  CREDENTIAL_WRONG: {
    errorCode: ErrorCode.UNAUTHORIZED,
    errorMessage: ErrorMessage[ErrorCode.UNAUTHORIZED],
    subErrorCode: 1601,
    subErrorMessage: 'Credential is wrong',
  } as ErrorData,
};
