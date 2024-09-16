import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';

interface IQuery {
  name: string;
  example?: any;
  required?: boolean;
  enum?: SwaggerEnumType;
}

export const ApiQueryURL = (queries: IQuery[]) => {
  if (!queries) {
    return null;
  }
  const queryList = queries.map((item) => {
    return ApiQuery({
      name: item.name,
      example: item.example,
      required: item.required ?? false,
      enum: item.enum,
    });
  });
  return applyDecorators(...queryList);
};
