import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { IsFile, MaxFileSize, HasMimeType, FileSystemStoredFile, IsFiles } from 'nestjs-form-data';
import { ProductStatus } from '../../../common/enum';

export class ProductSize {
  @ApiProperty({ example: 'SKU1' })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({ example: 'Size lớn' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 12000 })
  @IsNotEmpty()
  @IsNumber()
  @Transform((value) => Number(value.value))
  price: number;
}

export class CreateProductRequest {
  @ApiProperty({ example: 'Quạt senko' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Quạt mát mùa hè' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'AVAILABLE' })
  @IsNotEmpty()
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @ApiProperty({ example: 12000 })
  @IsOptional()
  @Transform((value) => Number(value.value))
  price: number;

  @ApiProperty({ isArray: true, type: ProductSize })
  @Transform((data) => {
    return data.value.map((value: string) => JSON.parse(value) as ProductSize);
  })
  @IsArray()
  productSizeList: ProductSize[];

  @IsFiles()
  // @MaxFileSize(1e7)
  // @HasMimeType(['image/jpeg', 'image/png'])
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  imageList: Express.Multer.File[];

  @ApiProperty({ example: 123 })
  @IsNotEmpty()
  @IsString()
  categoryId: number;
}

export class UpdateProductRequest {
  @ApiProperty({ example: 'Quạt senko' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Quạt mát mùa hè' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'AVAILABLE' })
  @IsNotEmpty()
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @ApiProperty({ example: 12000 })
  @IsOptional()
  @Transform((value) => Number(value.value))
  price: number;

  @ApiProperty({ isArray: true, type: ProductSize })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed]; // Đảm bảo là mảng
      } catch (error) {
        throw new Error('Invalid JSON string');
      }
    }

    return value;
  })
  @IsArray()
  productSizeList: ProductSize[];

  // @MaxFileSize(1e7)
  // @HasMimeType(['image/jpeg', 'image/png'])
  @IsFiles({ always: false })
  @IsOptional()
  @IsArray()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  imageList?: Express.Multer.File[];

  @ApiProperty({ example: 123 })
  @IsNotEmpty()
  @IsString()
  categoryId: number;
}
