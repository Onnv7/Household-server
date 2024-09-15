import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CategoryStatus } from '../../../common/enum';

export class CreateCategory {
  @ApiProperty({ example: 'Giường' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'VISIBLE' })
  @IsNotEmpty()
  @IsEnum(CategoryStatus)
  status: CategoryStatus;
}

export class UpdateCategory {
  @ApiProperty({ example: 'Nệm' })
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'VISIBLE' })
  @IsNotEmpty()
  @IsEnum(CategoryStatus)
  status: CategoryStatus;
}
