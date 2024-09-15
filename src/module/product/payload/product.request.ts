import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  IsFile,
  MaxFileSize,
  HasMimeType,
  FileSystemStoredFile,
  IsFiles,
} from 'nestjs-form-data';
import { ProductStatus } from '../../../common/enum';

export class ProductSize {
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

export class ProductTest {
  @ApiProperty({ example: 'Quạt senko' })
  @IsNotEmpty()
  @IsString()
  name: string;

  // @IsFile()
  // @MaxFileSize(1e10, { each: true })
  // @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  // @ApiProperty({ type: 'string', format: 'binary', required: true })
  @IsFiles()
  @MaxFileSize(1e6, { each: true })
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  imageList: FileSystemStoredFile[];
}
