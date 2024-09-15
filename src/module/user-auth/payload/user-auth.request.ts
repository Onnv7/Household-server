import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { SwaggerConstant } from '../../../constant/swagger.constant';

export class RegisterUserRequest {
  @ApiProperty({
    example: SwaggerConstant.EMAIL_EX,
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

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

  @ApiProperty({
    example: SwaggerConstant.TOKEN_EX,
  })
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}

export class LoginUserRequest {
  @ApiProperty({
    example: SwaggerConstant.EMAIL_EX,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly email: string;

  @ApiProperty({
    example: SwaggerConstant.PASSWORD_EX,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
export class LoginWithZaloRequest {
  @ApiProperty({
    example: SwaggerConstant.TOKEN_EX,
  })
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @ApiProperty({
    example: SwaggerConstant.TOKEN_EX,
  })
  @IsNotEmpty()
  @IsString()
  readonly codeVerifier: string;
}

export class AuthGoogleRequest {
  @ApiProperty({
    example: SwaggerConstant.TOKEN_EX,
  })
  @IsNotEmpty()
  @IsString()
  readonly idToken: string;
}

export class SendCodeRequest {
  @ApiProperty({
    example: SwaggerConstant.EMAIL_EX,
  })
  @IsNotEmpty()
  @IsString()
  readonly email: string;
}

export class VerifyEmailCodeRequest {
  @ApiProperty({
    example: SwaggerConstant.EMAIL_EX,
  })
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty({
    example: SwaggerConstant.TOKEN_EX,
  })
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}

export class UpdatePasswordRequest {
  @ApiProperty({
    example: SwaggerConstant.PASSWORD_EX,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly oldPassword: string;

  @ApiProperty({
    example: SwaggerConstant.PASSWORD_EX,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly newPassword: string;
}

export class GoogleAuthHeaders {
  @ApiProperty({
    required: false,
    example: SwaggerConstant.PASSWORD_EX,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    required: false,
    example: SwaggerConstant.PASSWORD_EX,
  })
  @IsOptional()
  @IsString()
  idToken?: string;
}
