import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { SwaggerConstant } from '../../../constant/swagger.constant';
import { Gender } from '../../../common/enum';

export class UpdateUserProfileRequest {
  @ApiProperty({
    example: SwaggerConstant.FIRST_NAME_EX,
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    example: SwaggerConstant.LAST_NAME_EX,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    type: Gender,
    enum: Gender,
    example: SwaggerConstant.LAST_NAME_EX,
  })
  @IsEnum(Gender)
  gender: Gender;
}
