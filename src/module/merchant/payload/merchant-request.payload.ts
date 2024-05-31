import { ApiProperty } from '@nestjs/swagger';
import { SwaggerConstant } from '../../../constant/swagger.constant';
import { IsNotEmpty } from 'class-validator';

export class MerchantLoginRequest {
  @ApiProperty({ example: SwaggerConstant.ADMIN_USERNAME_EX })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: SwaggerConstant.ADMIN_PASSWORD_EX })
  @IsNotEmpty()
  password: string;
}
