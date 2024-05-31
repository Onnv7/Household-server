import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseAPI } from './response-api';
import { Hello } from '../../module/user-auth/payload/user-auth.response';
import { timestamp } from 'rxjs';

function getSchemaOptions(dataType: any): any {
  if (Array.isArray(dataType)) {
    return {
      type: 'array',
      items: { $ref: getSchemaPath(dataType[0]) },
    };
  } else {
    return {
      type: 'object',
      $ref: getSchemaPath(dataType),
    };
  }
}

export const ApiResponseCustom = ({
  dataType,
  status = 200,
}: {
  dataType: Type<unknown> | Type<unknown>[];
  status?: number;
}) => {
  const schemaOptions = getSchemaOptions(dataType);

  const actualType = Array.isArray(dataType) ? dataType[0] : dataType;

  return applyDecorators(
    ApiExtraModels(ResponseAPI, actualType),
    ApiResponse({
      status,
      schema: {
        type: 'object',
        properties: {
          data: schemaOptions,
          message: {
            type: 'string',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    }),
  );
};
