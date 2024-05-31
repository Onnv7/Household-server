import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { SwaggerConstant } from '../../../constant/swagger.constant';

export class RegisterUserRequest {
  @ApiProperty({
    example: SwaggerConstant.USERNAME_EX,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly username: string;

  @ApiProperty({
    example: SwaggerConstant.PASSWORD_EX,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiProperty({
    example: SwaggerConstant.FIRST_NAME_EX,
  })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    example: SwaggerConstant.LAST_NAME_EX,
  })
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;
}

export class LoginUserRequest {
  @ApiProperty({
    example: SwaggerConstant.USERNAME_EX,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly username: string;

  @ApiProperty({
    example: SwaggerConstant.PASSWORD_EX,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
