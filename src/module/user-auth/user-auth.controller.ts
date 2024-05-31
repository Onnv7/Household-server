import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  LoginUserRequest,
  RegisterUserRequest,
} from './payload/user-auth.request';
import { UserAuthService } from './user-auth.service';
import { plainToInstance } from 'class-transformer';
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor';
import { ResponseAPI } from '../../common/model/response-api';
import { ResponseMessage } from '../../constant/response.constant';
import { from } from 'rxjs';
import { LoginUserResponse } from './payload/user-auth.response';
import { AppService } from '../../app.service';

@ApiTags('User Auth')
@Controller('user/auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post('/register')
  async registerUser(@Body() body: RegisterUserRequest): Promise<ResponseAPI> {
    await this.userAuthService.registerUser(body);
    return { message: ResponseMessage.CREATE };
  }

  @Post('/login')
  async loginUser(
    @Body() body: LoginUserRequest,
  ): Promise<ResponseAPI<LoginUserResponse>> {
    const data = await this.userAuthService.loginUser(body);
    return { data: data, message: ResponseMessage.GET };
  }
}
