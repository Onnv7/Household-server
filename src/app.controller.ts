import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';

import { ResponseMessage } from './constant/response.constant';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Hello } from './module/user-auth/payload/user-auth.response';
import { ResponseAPI } from './common/model/response-api';
import { ApiResponseCustom } from './common/model/response-swagger';
import { JwtService } from '@nestjs/jwt';
import { BaseController } from './BaseController';
import { Roles } from './common/decorator/role.decorator';
import { RoleGuard } from './common/guard/role.guard';
import { Role } from './common/enum';

@Controller()
@ApiTags('app')
export class AppController extends BaseController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  @Get()
  @HttpCode(203)
  @ApiResponseCustom({ dataType: [Hello] })
  @ApiOperation({ summary: 'áđâsdá' })
  getHello(): ResponseAPI<string> {
    const data: Hello = { statement: this.appService.getHello() };

    return { data: this.jwtService.sign(data), message: ResponseMessage.GET };
  }

  @Get('test')
  @Roles([Role.ROLE_ADMIN])
  te0st(@Request() req) {
    this.logger.log(req.user);
    return 'ok';
  }
}
