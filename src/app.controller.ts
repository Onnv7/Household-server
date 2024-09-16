import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';

import { ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { BaseController } from './BaseController';

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
}
