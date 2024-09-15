import { Body, Controller, Get, HttpCode, Param, Patch, Post, Headers, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthGoogleRequest,
  GoogleAuthHeaders,
  LoginUserRequest,
  LoginWithZaloRequest,
  RegisterUserRequest,
  SendCodeRequest,
  UpdatePasswordRequest,
  VerifyEmailCodeRequest,
} from './payload/user-auth.request';
import { Response } from 'express';
import { UserAuthService } from './user-auth.service';
import { ResponseAPI } from '../../common/model/response-api';
import { ResponseMessage } from '../../constant/response.constant';
import { LoginUserResponse, RefreshTokenResponse } from './payload/user-auth.response';
import { ApiResponseCustom } from '../../common/decorator/response-swagger.decorator';
import { BaseController } from '../../BaseController';
import * as moment from 'moment-timezone';
import { HasAuthorize } from '../../common/decorator/role.decorator';
import { Role } from '../../common/enum';
import { env } from '../../config/env-configuration.config';
import { Cookies } from '../../common/decorator/cookie.decorator';

@ApiTags('USER AUTH')
@Controller('user/auth')
export class UserAuthController extends BaseController {
  constructor(private readonly userAuthService: UserAuthService) {
    super();
  }

  @Post('/register')
  @ApiResponseCustom({ summary: 'Register a new user account', status: 201 })
  async registerUser(@Body() body: RegisterUserRequest): Promise<ResponseAPI> {
    await this.userAuthService.registerUser(body);
    return { message: ResponseMessage.CREATE };
  }

  @Post('/login')
  @ApiResponseCustom({
    dataType: LoginUserResponse,
    status: 200,
    summary: 'Login account to get token',
  })
  async loginUser(
    @Body() body: LoginUserRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseAPI<LoginUserResponse>> {
    const { refreshToken, ...data } = await this.userAuthService.loginUser(body);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: env.COOKIE_REFRESH_TOKEN_EXPIRE,
    });
    return { data: data, message: ResponseMessage.GET };
  }

  @Post('/send-code-register')
  @ApiResponseCustom({
    status: 200,
    summary: 'Send code to register account',
  })
  async sendCodeToEmailRegister(@Body() body: SendCodeRequest): Promise<ResponseAPI<void>> {
    await this.userAuthService.sendCodeToEmailRegister(body);
    return { message: ResponseMessage.CREATE };
  }

  @Post('/verify-email')
  @ApiResponseCustom({
    status: 200,
    summary: 'Verify code send to email',
  })
  async verifyEmailCode(@Body() body: VerifyEmailCodeRequest): Promise<ResponseAPI<void>> {
    await this.userAuthService.verifyEmailCode(body);
    return { message: ResponseMessage.UPDATE };
  }

  @Patch('/:userId/update-password')
  @ApiResponseCustom({
    status: 200,
    summary: 'Update password for user',
  })
  @HasAuthorize([Role.ROLE_USER])
  async updatePassword(
    @Param('userId') userId: number,
    @Body() body: UpdatePasswordRequest,
  ): Promise<ResponseAPI<void>> {
    await this.userAuthService.updatePassword(userId, body);
    return { message: ResponseMessage.UPDATE };
  }

  @Post('/login-zalo')
  @ApiResponseCustom({
    status: 200,
    summary: 'Login with zalo account',
  })
  async loginWithZalo(@Body() body: LoginWithZaloRequest): Promise<ResponseAPI<void>> {
    const data = await this.userAuthService.loginWithZalo(body);
    return { message: ResponseMessage.GET };
  }

  @Get('/google-auth')
  @ApiResponseCustom({
    status: 200,
    summary: 'Authenticate by google',
  })
  async authByGoogle(
    @Headers('code') code: string,
    @Headers('idToken') idToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseAPI<LoginUserResponse>> {
    const { refreshToken, ...data } = await this.userAuthService.authByGoogle({ code, idToken });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: env.COOKIE_REFRESH_TOKEN_EXPIRE,
    });
    return { data: data, message: ResponseMessage.GET };
  }

  @Get('/refresh-token')
  async refreshToken(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseAPI<RefreshTokenResponse>> {
    const { refreshToken: newRefreshToken, ...data } = await this.userAuthService.refreshToken(refreshToken);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: env.COOKIE_REFRESH_TOKEN_EXPIRE,
    });
    return { data: data, message: ResponseMessage.GET };
  }
}
