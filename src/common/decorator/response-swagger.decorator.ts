import { HttpCode, Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseAPI } from '../model/response-api';

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
  dataType = null,
  summary = null,
  status = 200,
}: {
  summary?: string;
  dataType?: Type<unknown> | Type<unknown>[];
  status?: number;
}) => {
  let apiResponse;
  let apiExtraModels;

  if (!dataType) {
    apiExtraModels = [ResponseAPI];
    apiResponse = {
      status,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    };
  } else {
    const schemaOptions = getSchemaOptions(dataType);
    apiExtraModels = [ResponseAPI, Array.isArray(dataType) ? dataType[0] : dataType];
    apiResponse = {
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
    };
  }

  return applyDecorators(
    HttpCode(status),
    ApiOperation({ summary: summary ?? '' }),
    ApiExtraModels(...apiExtraModels),
    ApiResponse(apiResponse),
  );
};
