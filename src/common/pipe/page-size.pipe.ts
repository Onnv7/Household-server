import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

// @Injectable()
export class PageSizeIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      throw new BadRequestException('Invalid value for page parameter');
    }
    return parsedValue;
  }
}
